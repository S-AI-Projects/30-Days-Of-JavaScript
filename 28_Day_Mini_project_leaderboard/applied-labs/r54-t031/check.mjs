import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { startServer } = require('./example.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workDir = path.resolve(__dirname, '../../../work/R54-T031');

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    try {
      const cr = createRequire('/opt/homebrew/lib/node_modules/');
      return cr('playwright');
    } catch {
      return require('playwright');
    }
  }
}

const testRecords = [];
function recordCheck(id, description, input, expected, actual, passed) {
  testRecords.push({ id, description, input, expected, actual, passed });
}

async function runChecks() {
  const { chromium } = await loadPlaywright();
  const { server, url } = await startServer(0);
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const pageErrors = [];

  try {
    const page = await browser.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto(url, { waitUntil: 'networkidle' });

    const readRows = () =>
      page.$$eval('.chart-row', (rows) =>
        rows.map((r) => ({
          label: r.querySelector('.row-label')?.textContent,
          value: r.querySelector('.row-value')?.textContent,
        }))
      );

    // 1. Initial Series A
    const initialRows = await readRows();
    const initialExpected = [
      { label: 'Alpha', value: '42' },
      { label: 'Beta', value: '78' },
      { label: 'Gamma', value: '55' },
    ];
    assert.deepEqual(initialRows, initialExpected);
    recordCheck('initial_series_a', 'Initial Series A renders expected values', 'Load page', initialExpected, initialRows, true);

    // 2. Switch A -> B without duplicating DOM nodes
    await page.click('#btn-series-b');
    const seriesBRows = await readRows();
    const seriesBExpected = [
      { label: 'Alpha', value: '65' },
      { label: 'Beta', value: '30' },
      { label: 'Gamma', value: '90' },
    ];
    assert.deepEqual(seriesBRows, seriesBExpected);
    assert.equal(seriesBRows.length, 3);
    recordCheck('switch_to_series_b', 'Switch A -> B updates values without duplicating DOM nodes', 'Click Series B', { count: 3, rows: seriesBExpected }, { count: seriesBRows.length, rows: seriesBRows }, true);

    // 3. Switch B -> A restores original values and keeps 3 DOM nodes
    await page.click('#btn-series-a');
    const restoredRows = await readRows();
    assert.deepEqual(restoredRows, initialExpected);
    assert.equal(restoredRows.length, 3);
    recordCheck('restore_series_a', 'Switch A -> B -> A restores original Series A values', 'Click Series A', initialExpected, restoredRows, true);

    // 4. Empty series displays explicit no-data message
    await page.click('#btn-series-empty');
    const noDataVisible = await page.isVisible('#no-data-message');
    const noDataText = await page.textContent('#no-data-message');
    assert.equal(noDataVisible, true);
    assert.match(noDataText, /No data available/i);
    recordCheck('empty_series_message', 'Empty data displays explicit no-data message', 'Click Empty Series', 'Visible no-data message', { visible: noDataVisible, text: noDataText }, true);

    // 5. Zero runtime errors
    assert.equal(consoleErrors.length, 0);
    assert.equal(pageErrors.length, 0);
    recordCheck('zero_runtime_errors', 'Zero console or page errors', 'All interactions', 0, consoleErrors.length + pageErrors.length, true);
  } finally {
    await browser.close();
    server.close();
  }

  fs.mkdirSync(workDir, { recursive: true });
  fs.writeFileSync(
    path.join(workDir, 'results.json'),
    JSON.stringify({ task: 'R54-T031', node: process.version, passed: testRecords.every((r) => r.passed), checks: testRecords }, null, 2)
  );
  const mdLines = [
    '# R54-T031 Check Results',
    '',
    `- Node: ${process.version}`,
    `- Status: ${testRecords.every((r) => r.passed) ? 'PASSED' : 'FAILED'}`,
    '',
    '| Check | Expected | Actual | Passed |',
    '| :--- | :--- | :--- | :--- |',
    ...testRecords.map((r) => `| ${r.id} | \`${JSON.stringify(r.expected)}\` | \`${JSON.stringify(r.actual)}\` | ${r.passed} |`),
  ];
  fs.writeFileSync(path.join(workDir, 'results.md'), mdLines.join('\n') + '\n');
}

runChecks().catch((err) => {
  console.error(err);
  process.exit(1);
});
