/**
 * Contribution focus: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.
 *
 * Automated Playwright validation check for Applied Lab (r54-t032).
 */

import { createRequire } from 'node:module';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workDir = path.resolve(__dirname, '../../../work/R54-T032');

const { startServer } = require('./example.js');

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

    // Test 1: Initial state
    const valA0 = (await page.textContent('#counter-a-val')).trim();
    const valB0 = (await page.textContent('#counter-b-val')).trim();
    const initPass = valA0 === '0' && valB0 === '0';
    recordCheck('initial_state', 'Both counters initialize to 0', 'page load', 'A=0, B=0', `A=${valA0}, B=${valB0}`, initPass);
    if (!initPass) throw new Error('Initial state mismatch');

    // Test 2: Increment Counter A twice
    await page.click('#btn-inc-a');
    await page.click('#btn-inc-a');
    const valA1 = (await page.textContent('#counter-a-val')).trim();
    const valB1 = (await page.textContent('#counter-b-val')).trim();
    const incPass = valA1 === '2' && valB1 === '0';
    recordCheck('closure_isolation', 'Increment A twice: A=2, B=0 (closure isolation)', '2x click A', 'A=2, B=0', `A=${valA1}, B=${valB1}`, incPass);
    if (!incPass) throw new Error('Closure isolation failed: Counter B modified or A not 2');

    // Test 3: Empty step input validation boundary
    await page.fill('#step-input-a', '');
    await page.click('#btn-step-a');
    const errEmpty = (await page.textContent('#error-a')).trim();
    const valAEmpty = (await page.textContent('#counter-a-val')).trim();
    const emptyPass = errEmpty.includes('empty') && valAEmpty === '2';
    recordCheck('boundary_empty_input', 'Empty step rejected with validation error without modifying counter', 'empty string', 'Error shown, A=2', `Error="${errEmpty}", A=${valAEmpty}`, emptyPass);
    if (!emptyPass) throw new Error('Empty input boundary check failed');

    // Test 4: Negative/out-of-bounds step validation
    await page.fill('#step-input-a', '-5');
    await page.click('#btn-step-a');
    const errNeg = (await page.textContent('#error-a')).trim();
    const valANeg = (await page.textContent('#counter-a-val')).trim();
    const negPass = errNeg.includes('positive integer') && valANeg === '2';
    recordCheck('boundary_negative_input', 'Negative step rejected with validation error without modifying counter', '-5', 'Error shown, A=2', `Error="${errNeg}", A=${valANeg}`, negPass);
    if (!negPass) throw new Error('Negative input boundary check failed');

    // Test 5: Recovery with valid step
    await page.fill('#step-input-a', '3');
    await page.click('#btn-step-a');
    const errRecover = (await page.textContent('#error-a')).trim();
    const valARecover = (await page.textContent('#counter-a-val')).trim();
    const valBRecover = (await page.textContent('#counter-b-val')).trim();
    const recoverPass = errRecover === '' && valARecover === '5' && valBRecover === '0';
    recordCheck('valid_step_recovery', 'Subsequent valid step clears error and increments counter A correctly', '3', 'Error cleared, A=5, B=0', `Error="${errRecover}", A=${valARecover}, B=${valBRecover}`, recoverPass);
    if (!recoverPass) throw new Error('Recovery with valid step failed');

    // Test 6: Zero runtime console/page errors
    const errorCountPass = consoleErrors.length === 0 && pageErrors.length === 0;
    recordCheck('zero_runtime_errors', 'No console errors or unhandled page exceptions', 'Execution lifecycle', '0 errors', `Console: ${consoleErrors.length}, Page: ${pageErrors.length}`, errorCountPass);
    if (!errorCountPass) throw new Error(`Runtime errors found: ${consoleErrors.concat(pageErrors).join(', ')}`);

    console.log('[check.mjs] All Playwright assertions passed successfully!');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  // Save results to work/R54-T032/
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  const resultsJson = {
    taskId: 'R54-T032',
    student: 'Anushka Jaiswal',
    contributionFocus: 'Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.',
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
  const markdown = `# Applied Lab Check Report (R54-T032)

> **Contribution focus**: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.

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
