/**
 * Applied Lab (R54-T035): Day 23 — Event Lifecycle & Deterministic Fixture Lab
 *
 * Contract:
 * - Attach a button handler once, expose cleanup, and verify keyboard activation.
 * - One click increments once; remounting does not duplicate handlers; cleanup prevents further updates.
 * - Contribution focus: Inject time, storage, events or network where used; use repeatable local fixtures
 *   and show that two isolated runs agree.
 */

const http = require('node:http');

/**
 * Pure deterministic event-lifecycle controller suitable for both Node and browser environments.
 */
function createCounterWidget({
  button,
  display,
  statusEl,
  initialCount = 0,
  clock = () => 0,
} = {}) {
  let count = initialCount;
  let mounted = false;
  let history = [];
  let listenerAttachCount = 0;

  function render() {
    if (display) display.textContent = String(count);
    if (statusEl) {
      statusEl.textContent = mounted ? 'mounted' : 'cleaned-up';
    }
  }

  function handleActivate(source) {
    if (!mounted) return;
    count += 1;
    history.push({ count, source, ts: clock() });
    render();
  }

  function onClick() {
    handleActivate('click');
  }

  function onKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      if (typeof event.preventDefault === 'function') event.preventDefault();
      handleActivate('keydown:' + event.key);
    }
  }

  function mount() {
    if (mounted) {
      return;
    }
    mounted = true;
    listenerAttachCount += 1;
    if (button) {
      button.addEventListener('click', onClick);
      button.addEventListener('keydown', onKeyDown);
    }
    render();
  }

  function cleanup() {
    if (!mounted) {
      return;
    }
    mounted = false;
    if (button) {
      button.removeEventListener('click', onClick);
      button.removeEventListener('keydown', onKeyDown);
    }
    render();
  }

  function remount() {
    cleanup();
    mount();
  }

  function getState() {
    return {
      count,
      mounted,
      listenerAttachCount,
      history: history.slice(),
    };
  }

  return { mount, cleanup, remount, getState, handleActivate };
}

/**
 * Runs a repeatable local fixture with injected clock and synthetic events.
 */
function runFixtureScenario(events = ['click', 'Enter', 'remount', 'click', 'cleanup', 'click']) {
  let tick = 100;
  const fakeClock = () => {
    tick += 10;
    return tick;
  };
  const widget = createCounterWidget({ initialCount: 0, clock: fakeClock });
  widget.mount();
  for (const step of events) {
    if (step === 'click') widget.handleActivate('click');
    else if (step === 'Enter') widget.handleActivate('keydown:Enter');
    else if (step === 'remount') widget.remount();
    else if (step === 'cleanup') widget.cleanup();
  }
  return widget.getState();
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 23: Event Lifecycle &amp; Deterministic Fixture Lab (R54-T035)</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #1f2937; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; background: #f9fafb; }
    .controls { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.75rem 0; }
    button { padding: 0.5rem 0.9rem; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; font-weight: 600; }
    button.primary { background: #2563eb; color: #fff; border-color: #2563eb; }
    pre { background: #111827; color: #f9fafb; padding: 0.75rem; border-radius: 6px; overflow-x: auto; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>Day 23: Event Lifecycle Lab</h1>

  <div class="card">
    <div>Count: <strong id="counter-value">0</strong> | Status: <strong id="widget-status">mounted</strong></div>
    <div class="controls">
      <button id="btn-increment" class="primary" type="button">Increment (+1)</button>
      <button id="btn-remount" type="button">Remount Widget</button>
      <button id="btn-cleanup" type="button">Cleanup Listeners</button>
    </div>
  </div>

  <div class="card">
    <h2>Deterministic Fixture Comparison</h2>
    <button id="btn-run-fixture" type="button">Run Isolated Fixtures</button>
    <p>Agreement: <strong id="fixture-agreement">pending</strong></p>
    <pre id="fixture-run-1"></pre>
    <pre id="fixture-run-2"></pre>
  </div>

  <script>
    function createBrowserWidget(button, display, statusEl, clock) {
      let count = 0;
      let mounted = false;
      const history = [];

      function render() {
        display.textContent = String(count);
        statusEl.textContent = mounted ? 'mounted' : 'cleaned-up';
      }

      function activate(source) {
        if (!mounted) return;
        count += 1;
        history.push({ count, source, ts: clock() });
        render();
      }

      function onClick() { activate('click'); }
      function onKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate('keydown:' + e.key);
        }
      }

      function mount() {
        if (mounted) return;
        mounted = true;
        button.addEventListener('click', onClick);
        button.addEventListener('keydown', onKeyDown);
        render();
      }

      function cleanup() {
        if (!mounted) return;
        mounted = false;
        button.removeEventListener('click', onClick);
        button.removeEventListener('keydown', onKeyDown);
        render();
      }

      function remount() {
        cleanup();
        mount();
      }

      return { mount, cleanup, remount, activate, getState: () => ({ count, mounted, history: history.slice() }) };
    }

    let liveTick = 0;
    const widget = createBrowserWidget(
      document.getElementById('btn-increment'),
      document.getElementById('counter-value'),
      document.getElementById('widget-status'),
      () => { liveTick += 1; return liveTick; }
    );
    widget.mount();

    document.getElementById('btn-remount').addEventListener('click', () => widget.remount());
    document.getElementById('btn-cleanup').addEventListener('click', () => widget.cleanup());

    function runIsolatedFixture() {
      let tick = 100;
      const clock = () => { tick += 10; return tick; };
      const btn = document.createElement('button');
      const disp = document.createElement('span');
      const stat = document.createElement('span');
      const w = createBrowserWidget(btn, disp, stat, clock);
      w.mount();
      btn.dispatchEvent(new MouseEvent('click'));
      btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
      w.remount();
      btn.dispatchEvent(new MouseEvent('click'));
      w.cleanup();
      btn.dispatchEvent(new MouseEvent('click'));
      return w.getState();
    }

    document.getElementById('btn-run-fixture').addEventListener('click', () => {
      const r1 = runIsolatedFixture();
      const r2 = runIsolatedFixture();
      const s1 = JSON.stringify(r1);
      const s2 = JSON.stringify(r2);
      document.getElementById('fixture-run-1').textContent = s1;
      document.getElementById('fixture-run-2').textContent = s2;
      document.getElementById('fixture-agreement').textContent = s1 === s2 ? 'AGREE' : 'MISMATCH';
    });
  </script>
</body>
</html>`;

function startServer(port = 0) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(HTML_CONTENT);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
    });
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const address = server.address();
      resolve({
        server,
        port: address.port,
        url: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  startServer(port).then(({ url }) => {
    console.log(`R54-T035 event lifecycle lab running at ${url}`);
  });
}

module.exports = { createCounterWidget, runFixtureScenario, startServer, HTML_CONTENT };
