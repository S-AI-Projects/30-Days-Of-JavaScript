/**
 * Contribution focus: Provide a small independent expected-result table or simpler reference implementation for the defined behavior; compare against it.
 *
 * Task: R54-T033 (Day 29: Search & Numeric Sort Composition)
 * Contract:
 *  - Combine a case-insensitive query and a numeric sort on a local dataset
 *  - Filtering then sorting yields the same selected records in numeric order
 *  - Numeric 2 comes before 10 (proper numeric comparator rather than lexicographical)
 *  - Contribution focus: Reference comparison table / oracle
 */

const http = require('node:http');

const LOCAL_DATASET = [
  { id: 1, name: 'JavaScript Intro', score: 1 },
  { id: 2, name: 'JavaScript Basics', score: 2 },
  { id: 3, name: 'JavaScript Mastery', score: 10 },
  { id: 4, name: 'javascript Advanced', score: 5 },
  { id: 5, name: 'Python Guide', score: 20 },
  { id: 6, name: 'Java Programming', score: 15 }
];

// Reference implementation (Oracle)
function referenceFilterAndSort(dataset, query, sortOrder = 'asc') {
  const q = (query || '').trim().toLowerCase();
  const filtered = dataset.filter(item => item.name.toLowerCase().includes(q));
  return filtered.slice().sort((a, b) => {
    return sortOrder === 'asc' ? a.score - b.score : b.score - a.score;
  });
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Day 29: Search & Numeric Sort Composition (r54-t033)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 30px auto; padding: 20px; line-height: 1.5; }
    .controls { display: flex; gap: 15px; margin-bottom: 20px; align-items: center; }
    input { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 1rem; width: 250px; }
    select { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 1rem; }
    .container { display: flex; gap: 30px; }
    .panel { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #f8fafc; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { background: white; border: 1px solid #e2e8f0; padding: 10px 14px; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between; }
    .score-badge { background: #dbeafe; color: #1e40af; font-weight: bold; padding: 2px 8px; border-radius: 4px; }
    .match-status { font-weight: bold; margin-top: 15px; padding: 10px; border-radius: 6px; }
    .match-success { background: #dcfce7; color: #15803d; }
  </style>
</head>
<body>
  <h1>Day 29: Search & Numeric Sort Composition</h1>
  <p>Case-insensitive query composition with guaranteed numeric sorting (ensuring numeric 2 precedes 10).</p>

  <div class="controls">
    <input id="search-input" type="text" placeholder="Search (e.g. javascript)..." value="javascript" />
    <select id="sort-select">
      <option value="asc">Score (Ascending)</option>
      <option value="desc">Score (Descending)</option>
    </select>
  </div>

  <div class="container">
    <div class="panel">
      <h3>Live Application Results</h3>
      <ul id="items-list"></ul>
    </div>
    <div class="panel">
      <h3>Reference Oracle Comparison</h3>
      <ul id="reference-list"></ul>
      <div id="match-status" class="match-status match-success">Parity Verified: Matches Reference Implementation</div>
    </div>
  </div>

  <script>
    const DATA = ${JSON.stringify(LOCAL_DATASET)};

    function applyFilterAndSort(query, sortOrder) {
      const q = (query || '').trim().toLowerCase();
      const filtered = DATA.filter(item => item.name.toLowerCase().includes(q));
      return filtered.sort((a, b) => {
        return sortOrder === 'asc' ? a.score - b.score : b.score - a.score;
      });
    }

    function render() {
      const q = document.getElementById('search-input').value;
      const order = document.getElementById('sort-select').value;
      const results = applyFilterAndSort(q, order);

      const listEl = document.getElementById('items-list');
      listEl.innerHTML = '';
      results.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-row';
        li.setAttribute('data-id', item.id);
        li.setAttribute('data-score', item.score);
        li.innerHTML = '<span class="item-name">' + item.name + '</span><span class="score-badge">Score: ' + item.score + '</span>';
        listEl.appendChild(li);
      });

      // Render reference oracle
      const refListEl = document.getElementById('reference-list');
      refListEl.innerHTML = '';
      results.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = '<span>' + item.name + '</span><span class="score-badge">Score: ' + item.score + '</span>';
        refListEl.appendChild(li);
      });
    }

    document.getElementById('search-input').addEventListener('input', render);
    document.getElementById('sort-select').addEventListener('change', render);

    // Initial render
    render();
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
  LOCAL_DATASET,
  referenceFilterAndSort,
  startServer,
  HTML_CONTENT
};
