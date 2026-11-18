import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import {
  LoggerSpy,
  calculateOrderTotal,
  calculateOrderTotalMutant
} from './example.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workDir = path.resolve(__dirname, '../../../work/R54-T040');

const testRecords = [];

function recordCheck(id, description, input, expected, actual, passed) {
  testRecords.push({ id, description, input, expected, actual, passed });
}

test.after(() => {
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  const resultsJson = {
    taskId: 'R54-T040',
    student: 'Anushka Jaiswal',
    contributionFocus: 'Create a temporary one-line mutant of the decisive condition; add a focused test that passes on the correct example and fails on that mutant.',
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
  const markdown = `# Applied Lab Check Report (R54-T040)

> **Contribution focus**: Create a temporary one-line mutant of the decisive condition; add a focused test that passes on the correct example and fails on that mutant.

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
});

test('Contract: Logger spy receives structured diagnostic event', () => {
  const spy = new LoggerSpy();
  const res = calculateOrderTotal(150, spy);

  assert.equal(spy.events.length, 1);
  const evt = spy.events[0];
  assert.equal(evt.type, 'DISCOUNT_EVALUATION');
  assert.equal(evt.subtotal, 150);
  assert.equal(evt.qualifies, true);
  assert.equal(evt.discount, 15);
  assert.equal(evt.total, 135);
  assert.equal(res.total, 135);
  recordCheck('logger_receives_event', 'Logger spy receives structured event', 150, 135, res.total, true);
});

test('Contract: Disabling or omitting logger returns identical computation result', () => {
  const withLogger = calculateOrderTotal(120, new LoggerSpy());
  const withoutLogger = calculateOrderTotal(120, null);
  const omittedLogger = calculateOrderTotal(120);

  const disabledSpy = new LoggerSpy();
  disabledSpy.enabled = false;
  const withDisabledLogger = calculateOrderTotal(120, disabledSpy);

  assert.deepEqual(withLogger, withoutLogger);
  assert.deepEqual(withoutLogger, omittedLogger);
  assert.deepEqual(omittedLogger, withDisabledLogger);
  assert.equal(disabledSpy.events.length, 0);

  recordCheck('parity_no_logger', 'Omitting logger preserves identical result', 120, withLogger, withoutLogger, true);
  recordCheck('parity_disabled_logger', 'Disabling logger preserves identical result and emits 0 events', 120, withLogger, withDisabledLogger, true);
});

test('Contribution focus: Focused boundary test passes on correct example and fails on decisive mutant', () => {
  // Boundary value: exact threshold of 100
  const boundaryInput = 100;

  // 1. Assert correct example qualifies at boundary >= 100
  const correctResult = calculateOrderTotal(boundaryInput);
  assert.equal(correctResult.qualifies, true);
  assert.equal(correctResult.discount, 10);
  assert.equal(correctResult.total, 90);
  recordCheck('correct_boundary_test', 'Correct example qualifies at boundary 100 (subtotal >= 100)', 100, 90, correctResult.total, true);

  // 2. Assert mutant fails the boundary requirement (mutant uses subtotal > 100, so 100 fails to get discount)
  const mutantResult = calculateOrderTotalMutant(boundaryInput);
  assert.equal(mutantResult.qualifies, false);
  assert.equal(mutantResult.discount, 0);
  assert.equal(mutantResult.total, 100);

  // Check that asserting expected qualification on mutant fails
  let mutantFailedAssertion = false;
  try {
    assert.equal(mutantResult.qualifies, true, 'Mutant should have qualified but failed');
  } catch (err) {
    mutantFailedAssertion = true;
  }
  assert.equal(mutantFailedAssertion, true);
  recordCheck('mutant_detected', 'Decisive mutant (subtotal > 100) correctly fails boundary test', 100, 'AssertionError on mutant', 'Mutant failed assertion as expected', true);
});
