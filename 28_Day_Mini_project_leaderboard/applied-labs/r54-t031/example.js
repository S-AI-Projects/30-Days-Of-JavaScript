/**
 * Applied Lab (R54-T031): Day 28 — Local Chart Dashboard
 *
 * Contract:
 * - Switch between two supplied data series (Series A and Series B) without duplicating DOM nodes.
 * - Switching A -> B -> A restores the original values.
 * - Empty data displays an explicit no-data message.
 */

const http = require('node:http');

const SERIES_DATA = {
  A: [
    { label: 'Alpha', value: 42 },
    { label: 'Beta', value: 78 },
    { label: 'Gamma', value: 55 },
  ],
  B: [
    { label: 'Alpha', value: 65 },
    { label: 'Beta', value: 30 },
    { label: 'Gamma', value: 90 },
  ],
  EMPTY: [],
};

/**
 * Pure helper to normalize a series payload for rendering.
 * @param {string} seriesKey
 * @param {Record<string, Array<{label: string, value: number}>>} dataset
 */
function renderSeries(seriesKey, dataset = SERIES_DATA) {
  const items = Array.isArray(dataset[seriesKey]) ? dataset[seriesKey] : [];
  if (items.length === 0) {
    return {
      seriesKey,
      hasData: false,
      message: 'No data available for the selected series.',
      items: [],
    };
  }
  const maxVal = Math.max(...items.map((item) => item.value), 1);
  return {
    seriesKey,
    hasData: true,
    message: '',
    items: items.map((item) => ({
      label: item.label,
      value: item.value,
      widthPercent: Math.round((item.value / maxVal) * 100),
    })),
  };
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 28: Local Chart Dashboard (R54-T031)</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #1f2937; }
    .controls { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; }
    button { padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; font-weight: 600; }
    button.active { background: #2563eb; color: #fff; border-color: #2563eb; }
    .chart-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; background: #f9fafb; }
    .chart-row { display: grid; grid-template-columns: 90px 1fr 50px; align-items: center; gap: 0.75rem; margin: 0.5rem 0; }
    .bar-track { background: #e5e7eb; height: 20px; border-radius: 4px; overflow: hidden; }
    .bar-fill { background: #2563eb; height: 100%; transition: width 0.15s ease; }
    .no-data { padding: 1rem; text-align: center; color: #b91c1c; font-weight: 600; background: #fef2f2; border-radius: 6px; }
    .meta { margin-top: 0.75rem; font-size: 0.875rem; color: #4b5563; }
  </style>
</head>
<body>
  <h1>Day 28: Local Chart Dashboard</h1>
  <div class="controls">
    <button id="btn-series-a" type="button">Series A</button>
    <button id="btn-series-b" type="button">Series B</button>
    <button id="btn-series-empty" type="button">Empty Series</button>
  </div>

  <div class="chart-box">
    <div id="chart-rows"></div>
    <div id="no-data-message" class="no-data" hidden>No data available for the selected series.</div>
  </div>

  <div class="meta">
    Active Series: <strong id="active-series">A</strong> |
    DOM Row Nodes: <strong id="dom-node-count">0</strong>
  </div>

  <script>
    const SERIES_DATA = ${JSON.stringify(SERIES_DATA)};

    const chartRowsEl = document.getElementById('chart-rows');
    const noDataEl = document.getElementById('no-data-message');
    const activeSeriesEl = document.getElementById('active-series');
    const domNodeCountEl = document.getElementById('dom-node-count');
    const btnA = document.getElementById('btn-series-a');
    const btnB = document.getElementById('btn-series-b');
    const btnEmpty = document.getElementById('btn-series-empty');

    // Pre-allocate or reuse row DOM nodes in place so switching never duplicates nodes.
    const rowPool = [];

    function getOrCreateRow(index) {
      if (rowPool[index]) {
        return rowPool[index];
      }
      const row = document.createElement('div');
      row.className = 'chart-row';

      const labelEl = document.createElement('span');
      labelEl.className = 'row-label';

      const trackEl = document.createElement('div');
      trackEl.className = 'bar-track';

      const fillEl = document.createElement('div');
      fillEl.className = 'bar-fill';
      trackEl.appendChild(fillEl);

      const valueEl = document.createElement('span');
      valueEl.className = 'row-value';

      row.appendChild(labelEl);
      row.appendChild(trackEl);
      row.appendChild(valueEl);

      chartRowsEl.appendChild(row);
      const entry = { row, labelEl, fillEl, valueEl };
      rowPool.push(entry);
      return entry;
    }

    function selectSeries(key) {
      const items = Array.isArray(SERIES_DATA[key]) ? SERIES_DATA[key] : [];
      activeSeriesEl.textContent = key;

      [btnA, btnB, btnEmpty].forEach((b) => b.classList.remove('active'));
      if (key === 'A') btnA.classList.add('active');
      if (key === 'B') btnB.classList.add('active');
      if (key === 'EMPTY') btnEmpty.classList.add('active');

      if (items.length === 0) {
        chartRowsEl.hidden = true;
        noDataEl.hidden = false;
        noDataEl.textContent = 'No data available for the selected series.';
        domNodeCountEl.textContent = String(chartRowsEl.querySelectorAll('.chart-row').length);
        return;
      }

      chartRowsEl.hidden = false;
      noDataEl.hidden = true;
      const maxVal = Math.max(...items.map((item) => item.value), 1);

      items.forEach((item, idx) => {
        const entry = getOrCreateRow(idx);
        entry.row.hidden = false;
        entry.labelEl.textContent = item.label;
        entry.valueEl.textContent = String(item.value);
        entry.fillEl.style.width = Math.round((item.value / maxVal) * 100) + '%';
      });

      for (let i = items.length; i < rowPool.length; i += 1) {
        rowPool[i].row.hidden = true;
      }

      domNodeCountEl.textContent = String(chartRowsEl.querySelectorAll('.chart-row').length);
    }

    btnA.addEventListener('click', () => selectSeries('A'));
    btnB.addEventListener('click', () => selectSeries('B'));
    btnEmpty.addEventListener('click', () => selectSeries('EMPTY'));

    selectSeries('A');
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
    console.log(`R54-T031 dashboard running at ${url}`);
  });
}

module.exports = { SERIES_DATA, renderSeries, startServer, HTML_CONTENT };
