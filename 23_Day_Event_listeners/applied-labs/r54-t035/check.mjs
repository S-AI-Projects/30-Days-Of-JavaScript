import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { startServer } = require('./example.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workDir = path.resolve(__dirname, '../../../work/R54-T035');

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

    // 1. Single click increments once
    await page.click('#btn-increment');
    const afterClick = await page.textContent('#counter-value');
    assert.equal(afterClick, '1');
    recordCheck('single_click', 'One click increments once', 'Click #btn-increment', '1', afterClick, true);

    // 2. Keyboard activation increments once
    await page.focus('#btn-increment');
    await page.keyboard.press('Enter');
    const afterKey = await page.textContent('#counter-value');
    assert.equal(afterKey, '2');
    recordCheck('keyboard_activation', 'Enter key activates button once', 'Press Enter', '2', afterKey, true);

    // 3. Remounting does not duplicate handlers
    await page.click('#btn-remount');
    await page.click('#btn-increment');
    const afterRemountClick = await page.textContent('#counter-value');
    assert.equal(afterRemountClick, '3');
    recordCheck('remount_no_duplicate', 'Remounting does not duplicate handlers', 'Remount + Click', '3', afterRemountClick, true);

    // 4. Cleanup prevents further updates
    await page.click('#btn-cleanup');
    await page.click('#btn-increment');
    const afterCleanupClick = await page.textContent('#counter-value');
    const statusAfterCleanup = await page.textContent('#widget-status');
    assert.equal(afterCleanupClick, '3');
    assert.equal(statusAfterCleanup, 'cleaned-up');
    recordCheck('cleanup_prevents_updates', 'Cleanup prevents further updates', 'Cleanup + Click', { count: '3', status: 'cleaned-up' }, { count: afterCleanupClick, status: statusAfterCleanup }, true);

    // 5. Two isolated deterministic fixture runs agree
    await page.click('#btn-run-fixture');
    const agreement = await page.textContent('#fixture-agreement');
    const run1 = await page.textContent('#fixture-run-1');
    const run2 = await page.textContent('#fixture-run-2');
    assert.equal(agreement, 'AGREE');
    assert.equal(run1, run2);
    recordCheck('isolated_fixtures_agree', 'Two isolated fixture runs agree', 'Run Isolated Fixtures', 'AGREE', agreement, true);

    // 6. Zero runtime errors
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
    JSON.stringify({ task: 'R54-T035', node: process.version, passed: testRecords.every((r) => r.passed), checks: testRecords }, null, 2)
  );
  const mdLines = [
    '# R54-T035 Check Results',
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
