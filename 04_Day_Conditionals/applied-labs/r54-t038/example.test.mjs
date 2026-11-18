import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import { classifyScore, ScoreClassifierSession } from './example.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workDir = path.resolve(__dirname, '../../../work/R54-T038');

const testRecords = [];

function recordCheck(id, description, input, expected, actual, passed) {
  testRecords.push({ id, description, input, expected, actual, passed });
}

test.after(() => {
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  const resultsJson = {
    taskId: 'R54-T038',
    student: 'Anushka Jaiswal',
    contributionFocus: 'Demonstrate the stated error or empty state, then a successful recovery on the next valid input without restarting the example.',
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
  const markdown = `# Applied Lab Check Report (R54-T038)

> **Contribution focus**: Demonstrate the stated error or empty state, then a successful recovery on the next valid input without restarting the example.

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

test('Boundary classifications (39->fail, 40->pass, 74->pass, 75->distinction)', () => {
  const c39 = classifyScore(39);
  assert.equal(c39, 'fail');
  recordCheck('boundary_39', 'Score 39 yields fail', 39, 'fail', c39, true);

  const c40 = classifyScore(40);
  assert.equal(c40, 'pass');
  recordCheck('boundary_40', 'Score 40 yields pass', 40, 'pass', c40, true);

  const c74 = classifyScore(74);
  assert.equal(c74, 'pass');
  recordCheck('boundary_74', 'Score 74 yields pass', 74, 'pass', c74, true);

  const c75 = classifyScore(75);
  assert.equal(c75, 'distinction');
  recordCheck('boundary_75', 'Score 75 yields distinction', 75, 'distinction', c75, true);

  const c0 = classifyScore(0);
  assert.equal(c0, 'fail');
  recordCheck('boundary_0', 'Lower bound 0 yields fail', 0, 'fail', c0, true);

  const c100 = classifyScore(100);
  assert.equal(c100, 'distinction');
  recordCheck('boundary_100', 'Upper bound 100 yields distinction', 100, 'distinction', c100, true);
});

test('Rejection of invalid and out-of-range scores (< 0 or > 100 or non-numbers)', () => {
  assert.throws(() => classifyScore(-1), RangeError);
  recordCheck('reject_negative', 'Score -1 throws RangeError', -1, 'RangeError', 'RangeError thrown', true);

  assert.throws(() => classifyScore(101), RangeError);
  recordCheck('reject_over_100', 'Score 101 throws RangeError', 101, 'RangeError', 'RangeError thrown', true);

  assert.throws(() => classifyScore('invalid'), TypeError);
  recordCheck('reject_non_number', 'String score throws TypeError', 'invalid', 'TypeError', 'TypeError thrown', true);

  assert.throws(() => classifyScore(null), TypeError);
  recordCheck('reject_null', 'Null score throws TypeError', null, 'TypeError', 'TypeError thrown', true);
});

test('Contribution focus: Error/empty state followed by immediate successful recovery without restart', () => {
  const session = new ScoreClassifierSession();

  // Initial valid state
  const step1 = session.process(50);
  assert.equal(step1.ok, true);
  assert.equal(step1.grade, 'pass');
  assert.equal(session.lastError, null);
  recordCheck('session_initial_valid', 'Session starts in valid state', 50, 'pass', step1.grade, true);

  // Trigger error state (negative score)
  const step2 = session.process(-10);
  assert.equal(step2.ok, false);
  assert.match(step2.error, /0\.\.100/);
  assert.equal(session.lastResult, null);
  assert.ok(session.lastError !== null);
  recordCheck('session_error_state', 'Invalid input produces error state without session crash', -10, 'error state', 'error state recorded', true);

  // Trigger another error state (out-of-range score)
  const step3 = session.process(150);
  assert.equal(step3.ok, false);
  assert.match(step3.error, /0\.\.100/);
  assert.equal(session.lastResult, null);
  recordCheck('session_second_error', 'Out of range input maintains error state', 150, 'error state', 'error state recorded', true);

  // Immediate recovery on valid input without session restart
  const step4 = session.process(85);
  assert.equal(step4.ok, true);
  assert.equal(step4.grade, 'distinction');
  assert.equal(session.lastError, null);
  assert.equal(session.lastResult, 'distinction');
  recordCheck('session_recovery', 'Subsequent valid input immediately recovers session state', 85, 'distinction', step4.grade, true);

  // Second recovery on boundary input
  const step5 = session.process(39);
  assert.equal(step5.ok, true);
  assert.equal(step5.grade, 'fail');
  assert.equal(session.lastError, null);
  recordCheck('session_recovery_boundary', 'Subsequent boundary input correctly processed', 39, 'fail', step5.grade, true);
});
