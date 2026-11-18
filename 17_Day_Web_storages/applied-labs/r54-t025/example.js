/**
 * Contribution focus: Add a worked explanation from input through intermediate state to output, and make the published example executable by the test.
 *
 * Applied Lab (r54-t025) for Day 17: Web Storages (Versioned Local Storage & Graceful Recovery)
 * Contract:
 *  - Save a versioned settings object: { version: 1, theme: 'light'|'dark', ... }
 *  - Recover gracefully from missing or corrupted storage.
 *  - A valid stored theme reloads.
 *  - Malformed JSON and an unknown version fall back to documented defaults.
 *  - Worked explanation: input -> intermediate state -> output.
 */

const http = require('node:http');

const CURRENT_VERSION = 1;
const STORAGE_KEY = 'user_settings';

const DEFAULT_SETTINGS = Object.freeze({
  version: CURRENT_VERSION,
  theme: 'light',
  fontSize: 'medium'
});

/**
 * Pure parsing and recovery pipeline.
 * Worked explanation:
 *  1. Input: raw string from storage (or null)
 *  2. Intermediate State:
 *     - Parse JSON safely (catch SyntaxError)
 *     - Validate schema structure (must be object)
 *     - Validate version compatibility (version === CURRENT_VERSION)
 *  3. Output: effective valid settings object
 *
 * @param {string|null} rawValue
 * @returns {{ settings: object, intermediate: { parsed: boolean, validVersion: boolean, fallbackReason: string|null }, outputTheme: string }}
 */
function resolveSettings(rawValue) {
  // Step 1: Input inspection
  if (rawValue === null || rawValue === undefined) {
    return {
      settings: { ...DEFAULT_SETTINGS },
      intermediate: {
        raw: rawValue,
        parsed: false,
        validVersion: false,
        fallbackReason: 'Storage is empty (null/undefined)'
      },
      outputTheme: DEFAULT_SETTINGS.theme
    };
  }

  // Step 2: Parsing intermediate state
  let parsedObj;
  try {
    parsedObj = JSON.parse(rawValue);
  } catch (err) {
    return {
      settings: { ...DEFAULT_SETTINGS },
      intermediate: {
        raw: rawValue,
        parsed: false,
        validVersion: false,
        fallbackReason: `Malformed JSON: ${err.message}`
      },
      outputTheme: DEFAULT_SETTINGS.theme
    };
  }

  // Schema & Version verification intermediate state
  if (typeof parsedObj !== 'object' || parsedObj === null) {
    return {
      settings: { ...DEFAULT_SETTINGS },
      intermediate: {
        raw: rawValue,
        parsed: true,
        validVersion: false,
        fallbackReason: 'Stored payload is not a valid object'
      },
      outputTheme: DEFAULT_SETTINGS.theme
    };
  }

  if (parsedObj.version !== CURRENT_VERSION) {
    return {
      settings: { ...DEFAULT_SETTINGS },
      intermediate: {
        raw: rawValue,
        parsed: true,
        validVersion: false,
        fallbackReason: `Unknown schema version: received ${parsedObj.version}, expected ${CURRENT_VERSION}`
      },
      outputTheme: DEFAULT_SETTINGS.theme
    };
  }

  // Valid output
  const validTheme = parsedObj.theme === 'dark' ? 'dark' : 'light';
  const effectiveSettings = {
    ...DEFAULT_SETTINGS,
    ...parsedObj,
    theme: validTheme
  };

  return {
    settings: effectiveSettings,
    intermediate: {
      raw: rawValue,
      parsed: true,
      validVersion: true,
      fallbackReason: null
    },
    outputTheme: effectiveSettings.theme
  };
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Day 17 Applied Lab: Versioned Local Storage</title>
  <style>
    :root {
      --bg: #ffffff;
      --text: #0f172a;
      --panel-bg: #f8fafc;
      --border: #cbd5e1;
    }
    body.theme-dark {
      --bg: #0f172a;
      --text: #f8fafc;
      --panel-bg: #1e293b;
      --border: #475569;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      max-width: 560px;
      margin: 2rem auto;
      padding: 1.5rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      transition: background-color 0.2s, color 0.2s;
    }
    h1 {
      font-size: 1.25rem;
      margin-top: 0;
    }
    .panel {
      background: var(--panel-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .control-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    select, button {
      padding: 0.5rem 0.75rem;
      font-size: 0.95rem;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--bg);
      color: var(--text);
      cursor: pointer;
    }
    .worked-explanation {
      font-size: 0.85rem;
      font-family: monospace;
      background: #0b1120;
      color: #38bdf8;
      padding: 0.75rem;
      border-radius: 4px;
      overflow-x: auto;
      white-space: pre-wrap;
    }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .badge-light { background: #e2e8f0; color: #0f172a; }
    .badge-dark { background: #334155; color: #f8fafc; }
  </style>
</head>
<body>
  <main>
    <h1>Day 17: Versioned Web Storage & Graceful Recovery</h1>
    <p><small>Contribution focus: Add a worked explanation from input through intermediate state to output, and make the published example executable by the test.</small></p>

    <div class="panel">
      <div class="control-row">
        <label for="theme-select"><strong>Selected Theme:</strong></label>
        <select id="theme-select">
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </div>

      <div class="control-row">
        <span>Active Applied Theme:</span>
        <span id="current-theme" class="badge badge-light" data-theme="light">light</span>
      </div>

      <div class="control-row">
        <span>Storage Status:</span>
        <div id="storage-status" role="status" aria-live="polite">Initialized</div>
      </div>
    </div>

    <h3>Worked Explanation (State Pipeline)</h3>
    <div id="worked-explanation" class="worked-explanation">Awaiting storage evaluation...</div>
  </main>

  <script>
    (function () {
      const CURRENT_VERSION = ${CURRENT_VERSION};
      const STORAGE_KEY = '${STORAGE_KEY}';
      const DEFAULT_SETTINGS = ${JSON.stringify(DEFAULT_SETTINGS)};

      const themeSelect = document.getElementById('theme-select');
      const currentThemeEl = document.getElementById('current-theme');
      const statusEl = document.getElementById('storage-status');
      const explanationEl = document.getElementById('worked-explanation');

      function resolveSettings(rawValue) {
        if (rawValue === null || rawValue === undefined) {
          return {
            settings: { ...DEFAULT_SETTINGS },
            intermediate: { raw: rawValue, parsed: false, validVersion: false, fallbackReason: 'Storage is empty (null/undefined)' },
            outputTheme: DEFAULT_SETTINGS.theme
          };
        }

        let parsedObj;
        try {
          parsedObj = JSON.parse(rawValue);
        } catch (err) {
          return {
            settings: { ...DEFAULT_SETTINGS },
            intermediate: { raw: rawValue, parsed: false, validVersion: false, fallbackReason: 'Malformed JSON: ' + err.message },
            outputTheme: DEFAULT_SETTINGS.theme
          };
        }

        if (typeof parsedObj !== 'object' || parsedObj === null) {
          return {
            settings: { ...DEFAULT_SETTINGS },
            intermediate: { raw: rawValue, parsed: true, validVersion: false, fallbackReason: 'Payload is not an object' },
            outputTheme: DEFAULT_SETTINGS.theme
          };
        }

        if (parsedObj.version !== CURRENT_VERSION) {
          return {
            settings: { ...DEFAULT_SETTINGS },
            intermediate: { raw: rawValue, parsed: true, validVersion: false, fallbackReason: 'Unknown schema version: ' + parsedObj.version },
            outputTheme: DEFAULT_SETTINGS.theme
          };
        }

        const validTheme = parsedObj.theme === 'dark' ? 'dark' : 'light';
        return {
          settings: { ...DEFAULT_SETTINGS, ...parsedObj, theme: validTheme },
          intermediate: { raw: rawValue, parsed: true, validVersion: true, fallbackReason: null },
          outputTheme: validTheme
        };
      }

      function applyTheme(theme) {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add('theme-' + theme);
        currentThemeEl.textContent = theme;
        currentThemeEl.setAttribute('data-theme', theme);
        currentThemeEl.className = 'badge badge-' + theme;
        themeSelect.value = theme;
      }

      function updateWorkedExplanation(flow) {
        const text = [
          '== WORKED EXPLANATION ==',
          '[1. Input]: ' + JSON.stringify(flow.intermediate.raw),
          '[2. Intermediate State]:',
          '    - Parsed JSON: ' + flow.intermediate.parsed,
          '    - Valid Version: ' + flow.intermediate.validVersion,
          '    - Fallback Reason: ' + (flow.intermediate.fallbackReason || 'None (Valid)'),
          '[3. Output]:',
          '    - Effective Theme: ' + flow.outputTheme,
          '    - Applied Settings: ' + JSON.stringify(flow.settings)
        ].join('\\n');
        explanationEl.textContent = text;
      }

      function loadSettings() {
        let raw = null;
        try {
          raw = localStorage.getItem(STORAGE_KEY);
        } catch (e) {
          // localStorage access error fallback
        }

        const flow = resolveSettings(raw);
        applyTheme(flow.outputTheme);
        updateWorkedExplanation(flow);

        if (flow.intermediate.fallbackReason) {
          statusEl.textContent = 'Fallback Applied: ' + flow.intermediate.fallbackReason;
        } else {
          statusEl.textContent = 'Valid Settings Loaded from Storage';
        }

        return flow;
      }

      function saveSettings(theme) {
        const payload = {
          version: CURRENT_VERSION,
          theme: theme,
          fontSize: DEFAULT_SETTINGS.fontSize
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
          statusEl.textContent = 'Settings Saved (version ' + CURRENT_VERSION + ')';
        } catch (e) {
          statusEl.textContent = 'Failed to save settings';
        }
        return loadSettings();
      }

      themeSelect.addEventListener('change', function () {
        saveSettings(themeSelect.value);
      });

      // Initial load
      loadSettings();

      // Expose globally for automated Playwright inspection
      window.settingsApp = {
        loadSettings,
        saveSettings,
        resolveSettings,
        DEFAULT_SETTINGS,
        CURRENT_VERSION,
        STORAGE_KEY
      };
    })();
  </script>
</body>
</html>`;

/**
 * Creates and starts local HTTP server on given port (default: 0).
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
    console.log(`[example.js] Contribution focus: Add a worked explanation from input through intermediate state to output, and make the published example executable by the test.`);
  });
}

module.exports = {
  CURRENT_VERSION,
  STORAGE_KEY,
  DEFAULT_SETTINGS,
  resolveSettings,
  startServer,
  HTML_CONTENT
};
