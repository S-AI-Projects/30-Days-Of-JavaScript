/**
 * Contribution focus: Implement the required behavior from the explicit contract; show the smallest useful complete example.
 *
 * Automated Playwright validation check for Applied Lab (r54-t041).
 * Exercises:
 *  - 0 -> 32
 *  - 100 -> 212
 *  - -40 -> -40
 *  - Blank input shows an accessible error
 *  - Output is properly labelled
 *  - Zero console/page errors allowed
 */

import { createRequire } from 'node:module';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import example server
const { startServer } = require('./example.js');

// Resolve Playwright
let playwright;
try {
  playwright = await import('playwright');
} catch {
  try {
    playwright = require('/Users/anuragkushwaha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
  } catch (err) {
    console.error('Failed to resolve playwright:', err);
    process.exit(1);
  }
}

// Resolve Playwright assertions (expect)
let expect;
try {
  const pt = await import('playwright/test');
  expect = pt.expect;
} catch {
  try {
    const pt = require('/Users/anuragkushwaha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/test');
    expect = pt.expect;
  } catch (err) {
    console.error('Failed to resolve playwright/test expect:', err);
    process.exit(1);
  }
}

const { chromium } = playwright;

async function runChecks() {
  console.log('--------------------------------------------------');
  console.log('Running Applied Lab r54-t041 Contract Verification');
  console.log('Contribution focus: Implement the required behavior from the explicit contract; show the smallest useful complete example.');
  console.log('--------------------------------------------------');

  const testRecords = [];
  let serverInstance = null;
  let browser = null;

  try {
    // 1. Launch local app
    console.log('Launching local app server...');
    const { server, port, url } = await startServer(0);
    serverInstance = server;
    console.log(`Local app server running at: ${url}`);

    // 2. Launch browser
    console.log('Launching headless browser...');
    try {
      browser = await chromium.launch({ headless: true, channel: 'chrome' });
    } catch {
      browser = await chromium.launch({
        headless: true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      });
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    // Track console & page errors
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    // Navigate to local app
    await page.goto(url);

    const input = page.locator('#celsius-input');
    const submitBtn = page.locator('#convert-btn');
    const output = page.locator('#fahrenheit-output');
    const errorMsg = page.locator('#celsius-error');

    // Helper conversion runner
    async function testConversion(celsiusValue, expectedFahrenheit) {
      await input.fill(String(celsiusValue));
      await submitBtn.click();

      // Playwright assertions
      await expect(output).toHaveText(String(expectedFahrenheit));
      await expect(errorMsg).toHaveText('');
      await expect(input).toHaveAttribute('aria-invalid', 'false');

      const actualOutput = await output.textContent();
      testRecords.push({
        id: `conversion_${celsiusValue}`,
        description: `Convert ${celsiusValue}°C to ${expectedFahrenheit}°F`,
        input: celsiusValue,
        expected: String(expectedFahrenheit),
        actual: actualOutput,
        passed: actualOutput === String(expectedFahrenheit)
      });
      console.log(`✓ Case ${celsiusValue}°C -> ${actualOutput}°F (Expected: ${expectedFahrenheit})`);
    }

    // Exercise 1: 0 -> 32
    await testConversion(0, 32);

    // Exercise 2: 100 -> 212
    await testConversion(100, 212);

    // Exercise 3: -40 -> -40
    await testConversion(-40, -40);

    // Exercise 4: Blank input shows accessible error
    await input.fill('');
    await submitBtn.click();

    await expect(errorMsg).not.toHaveText('');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(output).toHaveText('');

    const actualErrorText = await errorMsg.textContent();
    const actualAriaInvalid = await input.getAttribute('aria-invalid');
    const actualBlankOutput = await output.textContent();
    const blankPassed = actualErrorText.length > 0 && actualAriaInvalid === 'true' && actualBlankOutput === '';

    testRecords.push({
      id: 'blank_input_validation',
      description: 'Blank input shows accessible error and invalid state',
      input: '',
      expected: 'Accessible error displayed, aria-invalid="true", blank output',
      actual: `Error: "${actualErrorText}", aria-invalid="${actualAriaInvalid}", output="${actualBlankOutput}"`,
      passed: blankPassed
    });
    console.log(`✓ Blank input shows accessible error: "${actualErrorText}"`);

    // Exercise 5: Accessibility Contract Attributes
    await expect(errorMsg).toHaveAttribute('role', 'alert');
    await expect(errorMsg).toHaveAttribute('aria-live', 'polite');
    await expect(input).toHaveAttribute('aria-describedby', 'celsius-error');
    await expect(page.locator('label[for="celsius-input"]')).toBeVisible();
    await expect(page.locator('label[for="fahrenheit-output"]')).toBeVisible();
    await expect(output).toHaveAttribute('for', 'celsius-input');

    testRecords.push({
      id: 'accessibility_markup',
      description: 'Verify accessible labels, aria-live, role, and output markup',
      input: 'DOM markup inspection',
      expected: 'role=alert, aria-live=polite, aria-describedby=celsius-error, labelled output',
      actual: 'All required accessible attributes present and linked',
      passed: true
    });
    console.log('✓ Accessibility contract attributes validated');

    // Exercise 6: Reject console/page errors
    const errorCount = consoleErrors.length + pageErrors.length;
    testRecords.push({
      id: 'zero_runtime_errors',
      description: 'Reject console errors and page exceptions',
      input: 'Runtime page execution',
      expected: '0 console/page errors',
      actual: `${consoleErrors.length} console errors, ${pageErrors.length} page errors`,
      passed: errorCount === 0
    });

    if (errorCount > 0) {
      throw new Error(`Execution encountered ${errorCount} errors:\nConsole: ${consoleErrors.join(', ')}\nPage: ${pageErrors.join(', ')}`);
    }
    console.log('✓ Zero console/page errors confirmed');

    // Tool versions
    const versions = {
      node: process.version,
      playwright: require('/Users/anuragkushwaha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json').version,
      os: `${os.type()} ${os.release()} (${os.arch()})`,
      timestamp: new Date().toISOString()
    };

    // Save results in work/R54-T041/
    const workDir = path.resolve(__dirname, '../../../work/R54-T041');
    fs.mkdirSync(workDir, { recursive: true });

    const resultsPayload = {
      contributionFocus: 'Implement the required behavior from the explicit contract; show the smallest useful complete example.',
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
      '# Applied Lab Check Report (R54-T041)',
      '',
      '> **Contribution focus**: Implement the required behavior from the explicit contract; show the smallest useful complete example.',
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
