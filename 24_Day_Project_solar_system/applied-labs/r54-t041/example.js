/**
 * Contribution focus: Implement the required behavior from the explicit contract; show the smallest useful complete example.
 *
 * Applied Lab (r54-t041) for Day 24: Project Solar System (DOM & Interactive Forms)
 * Contract:
 *  - Convert Celsius to Fahrenheit: °F = (°C * 9/5) + 32
 *  - Explicit test cases: 0 -> 32, 100 -> 212, -40 -> -40
 *  - Blank input shows an accessible error (role="alert", aria-live="polite", aria-invalid="true")
 *  - Output is properly labelled (<label for="fahrenheit-output"> with <output id="fahrenheit-output">)
 */

const http = require('node:http');

/**
 * Pure conversion formula: (C * 9/5) + 32
 * @param {number} celsius
 * @returns {number}
 */
function convertCelsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Day 24 Applied Lab: Temperature Converter</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 400px;
      margin: 2rem auto;
      padding: 1.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
    }
    h1 {
      font-size: 1.25rem;
      color: #0f172a;
      margin-top: 0;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: #334155;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #94a3b8;
      border-radius: 4px;
    }
    input[aria-invalid="true"] {
      border-color: #dc2626;
      background-color: #fef2f2;
    }
    .error-message {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      min-height: 1.25rem;
    }
    button {
      width: 100%;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      color: #ffffff;
      background-color: #2563eb;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #1d4ed8;
    }
    .output-group {
      margin-top: 1rem;
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      font-size: 1.125rem;
    }
    output {
      font-weight: 700;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <main>
    <h1>Temperature Converter</h1>
    <p><small>Contribution focus: Implement the required behavior from the explicit contract; show the smallest useful complete example.</small></p>

    <form id="converter-form" novalidate>
      <div class="form-group">
        <label for="celsius-input">Celsius (°C):</label>
        <input
          type="number"
          id="celsius-input"
          name="celsius"
          step="any"
          aria-describedby="celsius-error"
          aria-invalid="false"
        />
        <div id="celsius-error" class="error-message" role="alert" aria-live="polite"></div>
      </div>

      <button type="submit" id="convert-btn">Convert</button>

      <div class="output-group">
        <label for="fahrenheit-output">Fahrenheit (°F):</label>
        <output id="fahrenheit-output" for="celsius-input"></output>
      </div>
    </form>
  </main>

  <script>
    const form = document.getElementById('converter-form');
    const celsiusInput = document.getElementById('celsius-input');
    const celsiusError = document.getElementById('celsius-error');
    const fahrenheitOutput = document.getElementById('fahrenheit-output');

    function convertCelsiusToFahrenheit(celsius) {
      return (celsius * 9) / 5 + 32;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const rawValue = celsiusInput.value.trim();

      // Blank input check
      if (rawValue === '') {
        celsiusError.textContent = 'Please enter a temperature in Celsius.';
        celsiusInput.setAttribute('aria-invalid', 'true');
        fahrenheitOutput.value = '';
        fahrenheitOutput.textContent = '';
        return;
      }

      const celsius = Number(rawValue);
      if (Number.isNaN(celsius)) {
        celsiusError.textContent = 'Please enter a valid numeric temperature.';
        celsiusInput.setAttribute('aria-invalid', 'true');
        fahrenheitOutput.value = '';
        fahrenheitOutput.textContent = '';
        return;
      }

      // Valid input
      celsiusError.textContent = '';
      celsiusInput.setAttribute('aria-invalid', 'false');

      const fahrenheit = convertCelsiusToFahrenheit(celsius);
      const formatted = Number.isInteger(fahrenheit)
        ? fahrenheit.toString()
        : parseFloat(fahrenheit.toFixed(2)).toString();

      fahrenheitOutput.value = formatted;
      fahrenheitOutput.textContent = formatted;
    });

    celsiusInput.addEventListener('input', function () {
      if (celsiusInput.value.trim() !== '') {
        celsiusError.textContent = '';
        celsiusInput.setAttribute('aria-invalid', 'false');
      }
    });
  </script>
</body>
</html>`;

/**
 * Creates and starts the local HTTP server.
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

// Start immediately if executed directly
if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  startServer(port).then(({ url }) => {
    console.log(`[example.js] Local app running at: ${url}`);
    console.log(`[example.js] Contribution focus: Implement the required behavior from the explicit contract; show the smallest useful complete example.`);
  });
}

module.exports = {
  convertCelsiusToFahrenheit,
  startServer,
  HTML_CONTENT
};
