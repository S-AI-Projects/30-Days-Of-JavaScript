/**
 * Contribution focus: Implement the required behavior from the explicit contract; show the smallest useful complete example.
 *
 * Applied Lab (r54-t021) for Day 23: Event Listeners (Event Lifecycle & Cleanup)
 * Contract:
 *  - Attach a button handler once, expose cleanup and verify keyboard activation.
 *  - One click increments once.
 *  - Remounting does not duplicate handlers.
 *  - Cleanup prevents further updates.
 */

const http = require('node:http');

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Day 23 Applied Lab: Event Lifecycle & Cleanup</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 480px;
      margin: 2rem auto;
      padding: 1.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background-color: #f8fafc;
      color: #0f172a;
    }
    h1 {
      font-size: 1.3rem;
      margin-top: 0;
      color: #0f172a;
    }
    .panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }
    .output-group {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    output {
      font-size: 1.75rem;
      font-weight: 700;
      color: #2563eb;
    }
    .status-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      margin-bottom: 1.25rem;
    }
    .status-pill {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .status-pill[data-status="mounted"] {
      background-color: #dcfce7;
      color: #166534;
    }
    .status-pill[data-status="cleaned-up"] {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    button {
      padding: 0.65rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 6px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
    }
    #increment-btn {
      background-color: #2563eb;
      color: #ffffff;
      border-color: #1d4ed8;
    }
    #increment-btn:hover {
      background-color: #1d4ed8;
    }
    #increment-btn:focus-visible {
      outline: 3px solid #93c5fd;
      outline-offset: 2px;
    }
    .lifecycle-controls {
      display: flex;
      gap: 0.5rem;
    }
    .lifecycle-controls button {
      flex: 1;
      font-size: 0.875rem;
      background-color: #f1f5f9;
      color: #334155;
      border-color: #cbd5e1;
    }
    .lifecycle-controls button:hover {
      background-color: #e2e8f0;
    }
  </style>
</head>
<body>
  <main>
    <h1>Day 23: Event Lifecycle & Cleanup</h1>
    <p><small>Contribution focus: Implement the required behavior from the explicit contract; show the smallest useful complete example.</small></p>

    <div class="panel">
      <div class="output-group">
        <label for="counter-output"><strong>Click Count:</strong></label>
        <output id="counter-output" for="increment-btn" aria-live="polite">0</output>
      </div>

      <div class="status-group">
        <span>Lifecycle Status:</span>
        <div id="lifecycle-status" class="status-pill" data-status="mounted" role="status" aria-live="polite">Mounted</div>
      </div>

      <div class="actions">
        <button type="button" id="increment-btn" aria-label="Increment Counter">
          Increment Counter
        </button>

        <div class="lifecycle-controls">
          <button type="button" id="remount-btn">Remount</button>
          <button type="button" id="cleanup-btn">Cleanup</button>
        </div>
      </div>
    </div>
  </main>

  <script>
    (function () {
      let count = 0;
      let isAttached = false;

      const incrementBtn = document.getElementById('increment-btn');
      const counterOutput = document.getElementById('counter-output');
      const statusEl = document.getElementById('lifecycle-status');
      const remountBtn = document.getElementById('remount-btn');
      const cleanupBtn = document.getElementById('cleanup-btn');

      function updateUI() {
        counterOutput.textContent = String(count);
        counterOutput.value = String(count);
      }

      function handleIncrement(event) {
        count += 1;
        updateUI();
      }

      /**
       * Attaches button handler once.
       * If remount is called while already attached, cleans up first to prevent duplicate handlers.
       */
      function mount() {
        if (isAttached) {
          incrementBtn.removeEventListener('click', handleIncrement);
          isAttached = false;
        }

        incrementBtn.addEventListener('click', handleIncrement);
        isAttached = true;
        statusEl.textContent = 'Mounted';
        statusEl.setAttribute('data-status', 'mounted');
      }

      /**
       * Exposes cleanup: removes listener, preventing further updates upon click or keyboard trigger.
       */
      function cleanup() {
        if (isAttached) {
          incrementBtn.removeEventListener('click', handleIncrement);
          isAttached = false;
        }
        statusEl.textContent = 'Cleaned up';
        statusEl.setAttribute('data-status', 'cleaned-up');
      }

      /**
       * Remounts handler safely without duplicating event listeners.
       */
      function remount() {
        mount();
      }

      remountBtn.addEventListener('click', remount);
      cleanupBtn.addEventListener('click', cleanup);

      // Initial mount
      mount();

      // Expose globally for automated tests / inspection
      window.counterApp = {
        mount,
        cleanup,
        remount,
        getCount: function () { return count; },
        isMounted: function () { return isAttached; }
      };
    })();
  </script>
</body>
</html>`;

/**
 * Starts the local HTTP server on a specified port (default: 0 for dynamic ephemeral port).
 * @param {number} port
 * @returns {Promise<{server: import('node:http').Server, port: number, url: string}>}
 */
function startServer(port = 0) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(HTML_CONTENT);
    });

    server.listen(port, () => {
      const actualPort = server.address().port;
      const url = `http://localhost:${actualPort}`;
      resolve({ server, port: actualPort, url });
    });
  });
}

// Start immediately if executed directly via `node example.js`
if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  startServer(port).then(({ url }) => {
    console.log(`[example.js] Local app running at: ${url}`);
    console.log(`[example.js] Contribution focus: Implement the required behavior from the explicit contract; show the smallest useful complete example.`);
  });
}

module.exports = {
  startServer,
  HTML_CONTENT
};
