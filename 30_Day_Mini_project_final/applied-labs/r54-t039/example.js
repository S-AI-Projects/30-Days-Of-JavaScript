/**
 * Applied Lab (R54-T039): Day 30 — Capstone State Restoration & Input-Scale Experiment
 *
 * Contract:
 * - Small task board with add/complete/filter actions and versioned local storage (v1).
 * - Add two tasks, complete one, reload, and filter completed: exactly that task appears.
 * - Corrupt storage is handled gracefully without crashing.
 * - Contribution focus: Check three bounded input sizes; assert correctness and report operation/render counts.
 */

const http = require('node:http');

const STORAGE_KEY = 'r54_t039_tasks_v1';
const SCHEMA_VERSION = 1;

function parseStoragePayload(raw) {
  if (raw == null || raw === '') {
    return { version: SCHEMA_VERSION, tasks: [], recoveredFromCorruption: false };
  }
  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.version !== SCHEMA_VERSION ||
      !Array.isArray(parsed.tasks)
    ) {
      return { version: SCHEMA_VERSION, tasks: [], recoveredFromCorruption: true };
    }
    const validTasks = parsed.tasks.filter(
      (t) => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.completed === 'boolean'
    );
    return {
      version: SCHEMA_VERSION,
      tasks: validTasks,
      recoveredFromCorruption: validTasks.length !== parsed.tasks.length,
    };
  } catch {
    return { version: SCHEMA_VERSION, tasks: [], recoveredFromCorruption: true };
  }
}

function serializeStoragePayload(tasks) {
  return JSON.stringify({ version: SCHEMA_VERSION, tasks });
}

function runScaleExperiment(sizes = [5, 20, 50]) {
  return sizes.map((n) => {
    const tasks = [];
    let ops = 0;
    for (let i = 1; i <= n; i += 1) {
      tasks.push({ id: `t-${i}`, title: `Task ${i}`, completed: i % 2 === 0 });
      ops += 1;
    }
    const completed = tasks.filter((t) => t.completed);
    ops += tasks.length;
    const serialized = serializeStoragePayload(tasks);
    const restored = parseStoragePayload(serialized);
    ops += 2;
    return {
      inputSize: n,
      totalRestored: restored.tasks.length,
      completedCount: completed.length,
      operationCount: ops,
      correct: restored.tasks.length === n && completed.length === Math.floor(n / 2),
    };
  });
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 30: Capstone Task Board (R54-T039)</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #1f2937; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; background: #f9fafb; }
    .row { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
    input[type="text"] { flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; }
    button { padding: 0.5rem 0.9rem; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; font-weight: 600; }
    button.active { background: #2563eb; color: #fff; border-color: #2563eb; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0; border-bottom: 1px solid #e5e7eb; }
    .warning { background: #fef3c7; color: #92400e; padding: 0.6rem; border-radius: 6px; margin-bottom: 0.75rem; font-weight: 600; }
    pre { background: #111827; color: #f9fafb; padding: 0.75rem; border-radius: 6px; font-size: 0.85rem; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Day 30: Capstone Task Board</h1>

  <div id="storage-warning" class="warning" hidden>Corrupt local storage detected; recovered with an empty task board.</div>

  <div class="card">
    <div class="row">
      <input id="task-input" type="text" placeholder="Enter a task title..." />
      <button id="btn-add" type="button">Add Task</button>
    </div>
    <div class="row">
      <button id="filter-all" class="active" type="button">All</button>
      <button id="filter-active" type="button">Active</button>
      <button id="filter-completed" type="button">Completed</button>
    </div>
    <ul id="task-list"></ul>
  </div>

  <div class="card">
    <h2>Bounded Input-Scale Experiment (N = 5, 20, 50)</h2>
    <button id="btn-run-scale" type="button">Run Scale Experiment</button>
    <pre id="scale-output"></pre>
  </div>

  <script>
    const STORAGE_KEY = ${JSON.stringify(STORAGE_KEY)};
    const SCHEMA_VERSION = ${SCHEMA_VERSION};

    function parseStorage(raw) {
      if (!raw) return { version: SCHEMA_VERSION, tasks: [], recovered: false };
      try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.tasks)) {
          return { version: SCHEMA_VERSION, tasks: [], recovered: true };
        }
        const valid = parsed.tasks.filter((t) => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.completed === 'boolean');
        return { version: SCHEMA_VERSION, tasks: valid, recovered: valid.length !== parsed.tasks.length };
      } catch {
        return { version: SCHEMA_VERSION, tasks: [], recovered: true };
      }
    }

    const initial = parseStorage(localStorage.getItem(STORAGE_KEY));
    let tasks = initial.tasks;
    let activeFilter = 'all';

    const warningEl = document.getElementById('storage-warning');
    if (initial.recovered) {
      warningEl.hidden = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, tasks: [] }));
    }

    const listEl = document.getElementById('task-list');
    const inputEl = document.getElementById('task-input');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');

    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, tasks }));
    }

    function render() {
      listEl.innerHTML = '';
      const visible = tasks.filter((t) => {
        if (activeFilter === 'active') return !t.completed;
        if (activeFilter === 'completed') return t.completed;
        return true;
      });

      for (const task of visible) {
        const li = document.createElement('li');
        li.className = 'task-item';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = task.completed;
        cb.addEventListener('change', () => {
          task.completed = cb.checked;
          save();
          render();
        });
        const span = document.createElement('span');
        span.className = 'task-title';
        span.textContent = task.title;
        li.appendChild(cb);
        li.appendChild(span);
        listEl.appendChild(li);
      }

      [filterAllBtn, filterActiveBtn, filterCompletedBtn].forEach((b) => b.classList.remove('active'));
      if (activeFilter === 'all') filterAllBtn.classList.add('active');
      if (activeFilter === 'active') filterActiveBtn.classList.add('active');
      if (activeFilter === 'completed') filterCompletedBtn.classList.add('active');
    }

    document.getElementById('btn-add').addEventListener('click', () => {
      const title = inputEl.value.trim();
      if (!title) return;
      tasks.push({ id: 'task-' + (tasks.length + 1) + '-' + Date.now(), title, completed: false });
      inputEl.value = '';
      save();
      render();
    });

    filterAllBtn.addEventListener('click', () => { activeFilter = 'all'; render(); });
    filterActiveBtn.addEventListener('click', () => { activeFilter = 'active'; render(); });
    filterCompletedBtn.addEventListener('click', () => { activeFilter = 'completed'; render(); });

    document.getElementById('btn-run-scale').addEventListener('click', () => {
      const sizes = [5, 20, 50];
      const report = sizes.map((n) => {
        const sample = [];
        let ops = 0;
        for (let i = 1; i <= n; i += 1) {
          sample.push({ id: 's-' + i, title: 'Sample ' + i, completed: i % 2 === 0 });
          ops += 1;
        }
        const completed = sample.filter((t) => t.completed);
        ops += sample.length;
        const roundTrip = parseStorage(JSON.stringify({ version: SCHEMA_VERSION, tasks: sample }));
        ops += 2;
        return {
          inputSize: n,
          totalRestored: roundTrip.tasks.length,
          completedCount: completed.length,
          operationCount: ops,
          correct: roundTrip.tasks.length === n && completed.length === Math.floor(n / 2),
        };
      });
      document.getElementById('scale-output').textContent = JSON.stringify(report, null, 2);
    });

    render();
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
    console.log(`R54-T039 task board running at ${url}`);
  });
}

module.exports = {
  STORAGE_KEY,
  SCHEMA_VERSION,
  parseStoragePayload,
  serializeStoragePayload,
  runScaleExperiment,
  startServer,
  HTML_CONTENT,
};
