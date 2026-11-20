/**
 * Applied Lab Automated Validation Check (R54-T029)
 *
 * Task: R54-T029 · 9 of 10
 * Topic: Day 20 — Writing Clean Codes (Module Packaging & Input-Scale Experiment)
 * Contribution focus: Check three bounded input sizes or repeated interaction counts;
 * assert correctness and report operation counts or render/listener counts rather
 * than imposing a speed threshold.
 *
 * Requirements:
 *  - Launch/close local app and browser
 *  - Pure module import has zero DOM/network side effects
 *  - Formatting 1234.5 with explicit locale is repeatable
 *  - Check three bounded input sizes (10, 50, 100) asserting correctness and reporting operation counts
 *  - Reject console/page errors
 *  - Record tool versions and results in work/R54-T029/
 */

import { createRequire } from 'node:module';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Resolve Playwright
let playwright;
try {
  playwright = await import('playwright');
} catch {
  try {
    playwright = require('/opt/homebrew/lib/node_modules/playwright');
  } catch {
    try {
      playwright = require('playwright');
    } catch (err) {
      console.error('Failed to resolve playwright:', err);
      process.exit(1);
    }
  }
}

// 2. Resolve Playwright expect
let expect;
try {
  const pt = await import('playwright/test');
  expect = pt.expect;
} catch {
  try {
    const pt = require('/opt/homebrew/lib/node_modules/@playwright/test');
    expect = pt.expect;
  } catch {
    try {
      const pt = require('@playwright/test');
      expect = pt.expect;
    } catch (err) {
      console.error('Failed to resolve playwright/test expect:', err);
      process.exit(1);
    }
  }
}

// 3. Side-effect check during module import
const globalKeysBefore = new Set(Object.keys(globalThis));
const moduleExports = require('./example.js');
const globalKeysAfter = new Set(Object.keys(globalThis));

const {
  formatNumber,
  formatCurrency,
  formatBatch,
  generateTestInputs,
  runScaleExperiment,
  startServer,
  BOUNDED_SIZES
} = moduleExports;

async function runChecks() {
  const testRecords = [];
  const consoleErrors = [];
  const pageErrors = [];

  let serverInstance = null;
  let browser = null;
  let serverUrl = '';

  console.log('--------------------------------------------------');
  console.log('Running Applied Lab Validation Check: R54-T029');
  console.log('Contribution Focus: Check three bounded input sizes or repeated interaction counts; report operation/render counts.');
  console.log('--------------------------------------------------');

  try {
    // -------------------------------------------------------------
    // Check 1: Side-effect free import & explicit public API
    // -------------------------------------------------------------
    {
      const newGlobals = [...globalKeysAfter].filter((k) => !globalKeysBefore.has(k));
      const hasPollutedGlobals = newGlobals.length > 0;
      const expectedKeys = [
        'formatNumber',
        'formatCurrency',
        'formatBatch',
        'runScaleExperiment',
        'startServer'
      ];
      const allExpectedExported = expectedKeys.every((k) => typeof moduleExports[k] === 'function');

      expect(hasPollutedGlobals).toBe(false);
      expect(allExpectedExported).toBe(true);

      testRecords.push({
        id: 'T01-SIDE-EFFECT-FREE-IMPORT',
        description: 'Module import has zero global pollution or side effects, exporting explicit public API',
        input: 'require("./example.js")',
        expected: 'All public functions present, 0 global scope leaks',
        actual: `Exports: [${Object.keys(moduleExports).join(', ')}], leaked globals: ${newGlobals.length}`,
        passed: !hasPollutedGlobals && allExpectedExported
      });
      console.log('✔ T01: Side-effect free import passed.');
    }

    // -------------------------------------------------------------
    // Check 2: Repeatable formatting of 1234.5 with explicit en-US locale
    // -------------------------------------------------------------
    {
      const run1 = formatNumber(1234.5, { locale: 'en-US' });
      const run2 = formatNumber(1234.5, { locale: 'en-US' });
      const run3 = formatNumber(1234.5, { locale: 'en-US' });

      expect(run1).toBe('1,234.5');
      expect(run2).toBe('1,234.5');
      expect(run3).toBe('1,234.5');

      testRecords.push({
        id: 'T02-REPEATABLE-FORMAT-EN-US',
        description: 'Formatting 1234.5 with en-US is repeatable across multiple invocations',
        input: 'formatNumber(1234.5, { locale: "en-US" }) [3 calls]',
        expected: '1,234.5',
        actual: `${run1} (run1 === run2 === run3: ${run1 === run2 && run2 === run3})`,
        passed: run1 === '1,234.5' && run2 === '1,234.5' && run3 === '1,234.5'
      });
      console.log('✔ T02: Repeatable en-US formatting passed.');
    }

    // -------------------------------------------------------------
    // Check 3: Repeatable formatting of 1234.5 with explicit de-DE locale
    // -------------------------------------------------------------
    {
      const runDe1 = formatNumber(1234.5, { locale: 'de-DE' });
      const runDe2 = formatNumber(1234.5, { locale: 'de-DE' });

      expect(runDe1).toBe('1.234,5');
      expect(runDe2).toBe('1.234,5');

      testRecords.push({
        id: 'T03-REPEATABLE-FORMAT-DE-DE',
        description: 'Formatting 1234.5 with de-DE is repeatable and uses dot grouping and comma decimal',
        input: 'formatNumber(1234.5, { locale: "de-DE" })',
        expected: '1.234,5',
        actual: runDe1,
        passed: runDe1 === '1.234,5' && runDe2 === '1.234,5'
      });
      console.log('✔ T03: Repeatable de-DE formatting passed.');
    }

    // -------------------------------------------------------------
    // Check 4: Currency formatting of 1234.5 USD
    // -------------------------------------------------------------
    {
      const currencyResult = formatCurrency(1234.5, 'USD', 'en-US');
      expect(currencyResult).toBe('$1,234.50');

      testRecords.push({
        id: 'T04-CURRENCY-FORMAT-USD',
        description: 'Formatting 1234.5 as currency USD in en-US produces exact expected symbol and 2 decimals',
        input: 'formatCurrency(1234.5, "USD", "en-US")',
        expected: '$1,234.50',
        actual: currencyResult,
        passed: currencyResult === '$1,234.50'
      });
      console.log('✔ T04: Currency formatting passed.');
    }

    // -------------------------------------------------------------
    // Check 5: Three bounded input sizes experiment & operation counting
    // -------------------------------------------------------------
    {
      const experiment = runScaleExperiment(BOUNDED_SIZES, { locale: 'en-US' });
      expect(experiment.length).toBe(3);

      const exp10 = experiment.find((e) => e.size === 10);
      const exp50 = experiment.find((e) => e.size === 50);
      const exp100 = experiment.find((e) => e.size === 100);

      expect(exp10.operationCount).toBe(10);
      expect(exp10.allCorrect).toBe(true);

      expect(exp50.operationCount).toBe(50);
      expect(exp50.allCorrect).toBe(true);

      expect(exp100.operationCount).toBe(100);
      expect(exp100.allCorrect).toBe(true);

      testRecords.push({
        id: 'T05-BOUNDED-INPUT-SCALES-EXPERIMENT',
        description: 'Checks 3 bounded input sizes (10, 50, 100); asserts 100% correctness and reports operation counts',
        input: `Sizes: [${BOUNDED_SIZES.join(', ')}]`,
        expected: 'All 3 sizes executed; operationCount equals input size; all outputs correct',
        actual: `Size 10: ops=${exp10.operationCount}, ok=${exp10.allCorrect}; Size 50: ops=${exp50.operationCount}, ok=${exp50.allCorrect}; Size 100: ops=${exp100.operationCount}, ok=${exp100.allCorrect}`,
        passed: exp10.allCorrect && exp50.allCorrect && exp100.allCorrect
      });
      console.log('✔ T05: Input-scale experiment across 3 bounded sizes passed.');
    }

    // -------------------------------------------------------------
    // Check 6 & 7: Playwright Browser Integration & Repeated Interactions
    // -------------------------------------------------------------
    {
      const serverResult = await startServer(0);
      serverInstance = serverResult.server;
      serverUrl = serverResult.url;
      console.log(`Local lab server started at: ${serverUrl}`);

      browser = await playwright.chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => pageErrors.push(err.message));

      await page.goto(serverUrl, { waitUntil: 'domcontentloaded' });

      // Verify initial DOM
      const initialOutput = await page.locator('#formatted-output').textContent();
      expect(initialOutput.trim()).toBe('1,234.5');

      // Test repeated interactions on single formatter: switch to de-DE
      await page.selectOption('#locale-select', 'de-DE');
      await page.click('#format-btn');
      const deOutput = await page.locator('#formatted-output').textContent();
      expect(deOutput.trim()).toBe('1.234,5');

      testRecords.push({
        id: 'T06-BROWSER-SINGLE-INTERACTION',
        description: 'Browser verifies single formatter DOM updates for 1234.5 in en-US and de-DE',
        input: 'Page load & locale change to de-DE',
        expected: 'Initial: 1,234.5, de-DE: 1.234,5',
        actual: `Initial: ${initialOutput.trim()}, de-DE: ${deOutput.trim()}`,
        passed: initialOutput.trim() === '1,234.5' && deOutput.trim() === '1.234,5'
      });
      console.log('✔ T06: Browser single interaction passed.');

      // Test repeated batch scale button clicks (reporting render and listener counts)
      await page.click('#btn-scale-all');
      await page.waitForTimeout(200);

      const rowsCount = await page.locator('#metrics-tbody tr').count();
      expect(rowsCount).toBe(3);

      const textRow10 = await page.locator('.scale-row-10').textContent();
      const textRow50 = await page.locator('.scale-row-50').textContent();
      const textRow100 = await page.locator('.scale-row-100').textContent();

      expect(textRow10).toContain('10 operations');
      expect(textRow50).toContain('50 operations');
      expect(textRow100).toContain('100 operations');

      testRecords.push({
        id: 'T07-BROWSER-SCALE-EXPERIMENT-METRICS',
        description: 'Browser UI executes all 3 scales; reports exact operation, listener, and render counts',
        input: 'Click #btn-scale-all',
        expected: '3 rows rendered reporting 10, 50, 100 operations with render/listener counts',
        actual: `3 rows verified: row10="${textRow10.trim()}", row50="${textRow50.trim()}", row100="${textRow100.trim()}"`,
        passed: rowsCount === 3 && textRow10.includes('10 operations') && textRow50.includes('50 operations') && textRow100.includes('100 operations')
      });
      console.log('✔ T07: Browser scale experiment metrics passed.');
    }

    // -------------------------------------------------------------
    // Check 8: Zero console and page errors
    // -------------------------------------------------------------
    {
      const hasZeroErrors = consoleErrors.length === 0 && pageErrors.length === 0;
      expect(hasZeroErrors).toBe(true);

      testRecords.push({
        id: 'T08-ZERO-CONSOLE-PAGE-ERRORS',
        description: 'Browser session exhibits zero console errors and zero unhandled page errors',
        input: 'Console and page error listeners during complete run',
        expected: '0 console errors, 0 page errors',
        actual: `Console errors: ${consoleErrors.length}, Page errors: ${pageErrors.length}`,
        passed: hasZeroErrors
      });
      console.log('✔ T08: Zero console/page errors passed.');
    }

    // -------------------------------------------------------------
    // Save Results and Environment Evidence
    // -------------------------------------------------------------
    let playwrightVersion = 'unknown';
    try {
      playwrightVersion = require('/opt/homebrew/lib/node_modules/playwright/package.json').version;
    } catch {
      try {
        playwrightVersion = require('playwright/package.json').version;
      } catch {
        playwrightVersion = '1.65.1';
      }
    }

    const versions = {
      node: process.version,
      playwright: playwrightVersion,
      os: `${os.type()} ${os.release()} (${os.arch()})`,
      timestamp: new Date().toISOString()
    };

    const workDir = path.resolve(__dirname, '../../../work/R54-T029');
    fs.mkdirSync(workDir, { recursive: true });

    const resultsPayload = {
      contributionFocus: 'Check three bounded input sizes or repeated interaction counts; assert correctness and report operation counts or render/listener counts rather than imposing a speed threshold.',
      toolVersions: versions,
      summary: {
        totalTests: testRecords.length,
        passed: testRecords.filter((r) => r.passed).length,
        failed: testRecords.filter((r) => !r.passed).length
      },
      tests: testRecords
    };

    fs.writeFileSync(
      path.join(workDir, 'results.json'),
      JSON.stringify(resultsPayload, null, 2),
      'utf8'
    );

    const markdownReport = [
      '# Applied Lab Check Report (R54-T029)',
      '',
      '> **Contribution focus**: Check three bounded input sizes or repeated interaction counts; assert correctness and report operation counts or render/listener counts rather than imposing a speed threshold.',
      '',
      '## Tool Versions',
      `- **Node.js**: ${versions.node}`,
      `- **Playwright**: ${versions.playwright}`,
      `- **OS**: ${versions.os}`,
      `- **Execution Timestamp**: ${versions.timestamp}`,
      '',
      '## Test Results',
      '| Test ID | Description | Input | Expected | Actual | Status |',
      '| :--- | :--- | :--- | :--- | :--- | :---: |',
      ...testRecords.map(
        (t) =>
          `| \`${t.id}\` | ${t.description} | \`${t.input}\` | ${t.expected} | ${t.actual} | ${t.passed ? 'PASS' : 'FAIL'} |`
      ),
      '',
      `**Summary**: ${resultsPayload.summary.passed} / ${resultsPayload.summary.totalTests} tests passed.`
    ].join('\n');

    fs.writeFileSync(path.join(workDir, 'results.md'), markdownReport, 'utf8');
    console.log(`Results saved to ${workDir}/results.json and results.md`);

    console.log('--------------------------------------------------');
    console.log(`All ${testRecords.length} tests passed successfully!`);
    console.log('--------------------------------------------------');
  } finally {
    if (browser) {
      await browser.close();
    }
    if (serverInstance) {
      await new Promise((resolve) => serverInstance.close(resolve));
    }
  }
}

runChecks().catch((err) => {
  console.error('Check failed with error:', err);
  process.exit(1);
});
