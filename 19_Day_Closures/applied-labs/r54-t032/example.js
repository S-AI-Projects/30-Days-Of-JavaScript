/**
 * Contribution focus: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.
 *
 * Task: R54-T032 (Day 19: Closure Isolation & Boundary Validation Lab)
 * Contract:
 *  - Create two independent counters through closures and expose increment/read methods
 *  - Increment one instance twice: its value is 2 while the other is 0
 *  - Internal state is enclosed in closure, not a global variable
 *  - Explicit boundary validation on empty, negative, and invalid step inputs
 */

const http = require('node:http');

function createCounter(initialValue = 0) {
  let count = initialValue; // Lexically enclosed private state

  return {
    increment(step = 1) {
      if (step === '' || step === null || step === undefined) {
        throw new TypeError('Step cannot be empty');
      }
      const num = Number(step);
      if (Number.isNaN(num) || typeof num !== 'number') {
        throw new TypeError('Step must be a valid number');
      }
      if (num <= 0 || !Number.isInteger(num)) {
        throw new RangeError('Step must be a positive integer (> 0)');
      }
      count += num;
      return count;
    },
    read() {
      return count;
    }
  };
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Closure Isolation Lab (r54-t032)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    .card-grid { display: flex; gap: 20px; margin: 20px 0; }
    .card { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #f8fafc; }
    .value { font-size: 2.5rem; font-weight: bold; color: #2563eb; margin: 10px 0; }
    button { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 500; }
    button:hover { background: #1d4ed8; }
    .error { color: #dc2626; font-size: 0.9rem; margin-top: 10px; min-height: 1.4em; }
    input { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; width: 80px; }
    .docs { background: #f1f5f9; padding: 15px; border-radius: 6px; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>Day 19: Independent Closure Counters</h1>
  <p>Two isolated counter instances instantiated from factory closures with encapsulated private variables.</p>

  <div class="card-grid">
    <div class="card">
      <h3>Counter A</h3>
      <div id="counter-a-val" class="value">0</div>
      <button id="btn-inc-a">Increment A</button>
      <div style="margin-top: 15px;">
        <input id="step-input-a" type="text" placeholder="Step" />
        <button id="btn-step-a">Add Step</button>
      </div>
      <div id="error-a" class="error"></div>
    </div>

    <div class="card">
      <h3>Counter B</h3>
      <div id="counter-b-val" class="value">0</div>
      <button id="btn-inc-b">Increment B</button>
      <div style="margin-top: 15px;">
        <input id="step-input-b" type="text" placeholder="Step" />
        <button id="btn-step-b">Add Step</button>
      </div>
      <div id="error-b" class="error"></div>
    </div>
  </div>

  <div class="docs" id="boundary-explanation">
    <strong>Boundary Contract:</strong> Step values must be strictly positive integers (<code>step &gt; 0</code>).
    Empty inputs, non-numeric values, decimals, zero, or negative numbers are rejected with boundary errors without modifying counter state.
  </div>

  <script>
    function createCounter(initialValue = 0) {
      let count = initialValue;
      return {
        increment(step = 1) {
          if (step === '' || step === null || step === undefined) {
            throw new TypeError('Step cannot be empty');
          }
          const num = Number(step);
          if (Number.isNaN(num)) {
            throw new TypeError('Step must be a valid number');
          }
          if (num <= 0 || !Number.isInteger(num)) {
            throw new RangeError('Step must be a positive integer (> 0)');
          }
          count += num;
          return count;
        },
        read() {
          return count;
        }
      };
    }

    const counterA = createCounter(0);
    const counterB = createCounter(0);

    const elValA = document.getElementById('counter-a-val');
    const elValB = document.getElementById('counter-b-val');
    const elErrA = document.getElementById('error-a');
    const elErrB = document.getElementById('error-b');

    document.getElementById('btn-inc-a').addEventListener('click', () => {
      counterA.increment(1);
      elValA.textContent = counterA.read();
      elErrA.textContent = '';
    });

    document.getElementById('btn-inc-b').addEventListener('click', () => {
      counterB.increment(1);
      elValB.textContent = counterB.read();
      elErrB.textContent = '';
    });

    document.getElementById('btn-step-a').addEventListener('click', () => {
      const raw = document.getElementById('step-input-a').value;
      try {
        counterA.increment(raw);
        elValA.textContent = counterA.read();
        elErrA.textContent = '';
      } catch (err) {
        elErrA.textContent = err.message;
      }
    });

    document.getElementById('btn-step-b').addEventListener('click', () => {
      const raw = document.getElementById('step-input-b').value;
      try {
        counterB.increment(raw);
        elValB.textContent = counterB.read();
        elErrB.textContent = '';
      } catch (err) {
        elErrB.textContent = err.message;
      }
    });
  </script>
</body>
</html>`;

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

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  startServer(port).then(({ url }) => {
    console.log(`[example.js] Local app running at: ${url}`);
  });
}

module.exports = {
  createCounter,
  startServer,
  HTML_CONTENT
};
