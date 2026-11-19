/**
 * Contribution focus: Provide a small independent expected-result table or simpler reference implementation for the defined behavior; compare against it.
 *
 * Automated Playwright validation check for Applied Lab (r54-t033).
 */

import { createRequire } from 'node:module';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workDir = path.resolve(__dirname, '../../../work/R54-T033');

const { startServer, referenceFilterAndSort, LOCAL_DATASET } = require('./example.js');

let playwright;
try {
  playwright = await import('playwright');
} catch {
  try {
    const cr = createRequire('/opt/homebrew/lib/node_modules/');
    playwright = cr('playwright');
  } catch {
    playwright = require('playwright');
  }
}
const { chromium } = playwright;

const testRecords = [];

function recordCheck(id, description, input, expected, actual, passed) {
  testRecords.push({ id, description, input, expected, actual, passed });
}

async function runChecks() {
  const { server, url } = await startServer(0);
  console.log(`[check.mjs] Server started at ${url}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Test 1: Case-insensitive search filtering and numeric sorting (query="javascript", asc)
    // Default search input has 'javascript'
    const items = await page.$$eval('#items-list .item-row', rows =>
      rows.map(r => ({
        id: Number(r.getAttribute('data-id')),
        score: Number(r.getAttribute('data-score')),
        text: r.querySelector('.item-name').textContent.trim()
      }))
    );

    const scores = items.map(i => i.score);
    const expectedRef = referenceFilterAndSort(LOCAL_DATASET, 'javascript', 'asc');
    const expectedScores = expectedRef.map(i => i.score);

    // Assert that numeric 2 precedes 10
    const twoIndex = scores.indexOf(2);
    const tenIndex = scores.indexOf(10);
    const orderValid = twoIndex !== -1 && tenIndex !== -1 && twoIndex < tenIndex;

    recordCheck('numeric_sort_order', 'Numeric 2 precedes 10 in sorted output', 'query="javascript", asc', '2 precedes 10', `scores: [${scores.join(', ')}]`, orderValid);
    if (!orderValid) throw new Error(`Numeric sorting failed: 2 must precede 10. Found scores: ${scores}`);

    // Assert parity against independent reference implementation
    const parity = JSON.stringify(scores) === JSON.stringify(expectedScores);
    recordCheck('reference_oracle_parity', 'UI results match independent reference oracle', 'query="javascript", asc', expectedScores, scores, parity);
    if (!parity) throw new Error('Parity check failed against reference oracle');

    // Test 2: Descending sort check
    await page.selectOption('#sort-select', 'desc');
    const descItems = await page.$$eval('#items-list .item-row', rows =>
      rows.map(r => Number(r.getAttribute('data-score')))
    );
    const expectedDesc = referenceFilterAndSort(LOCAL_DATASET, 'javascript', 'desc').map(i => i.score);
    const descParity = JSON.stringify(descItems) === JSON.stringify(expectedDesc);
    recordCheck('descending_sort_parity', 'Descending numeric sort matches reference', 'query="javascript", desc', expectedDesc, descItems, descParity);
    if (!descParity) throw new Error('Descending sort parity failed');

    // Test 3: Empty query returns full dataset sorted
    await page.fill('#search-input', '');
    const allItems = await page.$$eval('#items-list .item-row', rows =>
      rows.map(r => Number(r.getAttribute('data-score')))
    );
    const expectedAllDesc = referenceFilterAndSort(LOCAL_DATASET, '', 'desc').map(i => i.score);
    const allParity = JSON.stringify(allItems) === JSON.stringify(expectedAllDesc);
    recordCheck('all_items_parity', 'Empty query returns full dataset sorted', 'query="", desc', expectedAllDesc, allItems, allParity);
    if (!allParity) throw new Error('Full dataset parity failed');

    // Test 4: Zero runtime console/page errors
    const errorsPass = consoleErrors.length === 0 && pageErrors.length === 0;
    recordCheck('zero_runtime_errors', 'Zero console or page errors', 'Execution lifecycle', '0 errors', `Console: ${consoleErrors.length}, Page: ${pageErrors.length}`, errorsPass);
    if (!errorsPass) throw new Error(`Runtime errors found: ${consoleErrors.concat(pageErrors).join(', ')}`);

    console.log('[check.mjs] All Playwright assertions passed successfully!');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  // Save results to work/R54-T033/
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  const resultsJson = {
    taskId: 'R54-T033',
    student: 'Anushka Jaiswal',
    contributionFocus: 'Provide a small independent expected-result table or simpler reference implementation for the defined behavior; compare against it.',
    timestamp: new Date().toISOString(),
    toolVersions: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      os: `${os.type()} ${os.release()}`
    },
    checks: testRecords
  };

  fs.writeFileSync(path.join(workDir, 'results.json'), JSON.stringify(resultsJson, null, 2), 'utf8');

  const rows = testRecords.map(r => `| \`${r.id}\` | ${r.description} | \`${JSON.stringify(r.input)}\` | \`${JSON.stringify(r.expected)}\` | \`${JSON.stringify(r.actual)}\` | ${r.passed ? 'PASS' : 'FAIL'} |`).join('\n');
  const markdown = `# Applied Lab Check Report (R54-T033)

> **Contribution focus**: Provide a small independent expected-result table or simpler reference implementation for the defined behavior; compare against it.

## Tool Versions
- **Node.js**: ${process.version}
- **OS**: ${os.type()} ${os.release()} (${process.arch})
- **Execution Timestamp**: ${new Date().toISOString()}

## Test Results
| Test ID | Description | Input | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
${rows}

**Summary**: ${testRecords.filter(r => r.passed).length} / ${testRecords.length} tests passed.
`;

  fs.writeFileSync(path.join(workDir, 'results.md'), markdown, 'utf8');
}

runChecks().catch(err => {
  console.error('[check.mjs] Check failed:', err);
  process.exit(1);
});
