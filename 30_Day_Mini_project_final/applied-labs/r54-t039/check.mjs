import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { STORAGE_KEY, startServer } = require('./example.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workDir = path.resolve(__dirname, '../../../work/R54-T039');

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

    // 1. Add two tasks, complete one, reload, and filter Completed
    await page.fill('#task-input', 'Task Alpha');
    await page.click('#btn-add');
    await page.fill('#task-input', 'Task Beta');
    await page.click('#btn-add');
    await page.locator('.task-item input[type="checkbox"]').first().check();

    await page.reload({ waitUntil: 'networkidle' });
    await page.click('#filter-completed');

    const completedTitles = await page.$$eval('.task-title', (els) => els.map((e) => e.textContent));
    assert.deepEqual(completedTitles, ['Task Alpha']);
    recordCheck('persist_and_filter_completed', 'Add two, complete one, reload, filter Completed', 'Task Alpha (done), Task Beta', ['Task Alpha'], completedTitles, true);

    // 2. Corrupt storage recovery
    await page.evaluate((key) => {
      localStorage.setItem(key, '{corrupt-json');
    }, STORAGE_KEY);
    await page.reload({ waitUntil: 'networkidle' });

    const warningVisible = await page.isVisible('#storage-warning');
    const itemCountAfterCorrupt = await page.locator('.task-item').count();
    assert.equal(warningVisible, true);
    assert.equal(itemCountAfterCorrupt, 0);
    recordCheck('corrupt_storage_recovery', 'Corrupt localStorage recovers gracefully', '{corrupt-json', { warningVisible: true, count: 0 }, { warningVisible, count: itemCountAfterCorrupt }, true);

    // 3. Bounded 3-size scale experiment
    await page.click('#btn-run-scale');
    const scaleText = await page.textContent('#scale-output');
    const scaleReport = JSON.parse(scaleText);
    assert.equal(scaleReport.length, 3);
    assert.equal(scaleReport.every((r) => r.correct), true);
    recordCheck('bounded_scale_experiment', 'Three bounded input sizes pass correctness assertions', [5, 20, 50], true, scaleReport.every((r) => r.correct), true);

    // 4. Zero runtime errors
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
    JSON.stringify({ task: 'R54-T039', node: process.version, passed: testRecords.every((r) => r.passed), checks: testRecords }, null, 2)
  );
  const mdLines = [
    '# R54-T039 Check Results',
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
