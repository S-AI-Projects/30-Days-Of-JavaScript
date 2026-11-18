import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import { JsonCounterPipeline, parseCountJson } from './example.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workDir = path.resolve(__dirname, '../../../work/R54-T034');

const testRecords = [];

function recordCheck(id, description, input, expected, actual, passed) {
  testRecords.push({ id, description, input, expected, actual, passed });
}

test.after(() => {
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  const resultsJson = {
    taskId: 'R54-T034',
    student: 'Anushka Jaiswal',
    contributionFocus: 'State and test the invariant connecting input/state to output across a short sequence of operations.',
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
  const markdown = `# Applied Lab Check Report (R54-T034)

> **Contribution focus**: State and test the invariant connecting input/state to output across a short sequence of operations.

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

test('Contract: Valid {"count":2} succeeds', () => {
  const result = parseCountJson('{"count":2}');
  assert.equal(result.ok, true);
  assert.equal(result.data.count, 2);
  assert.equal(result.totalCount, 2);
  recordCheck('valid_json', 'Valid count payload succeeds', '{"count":2}', 2, result.totalCount, true);
});

test('Contract: Malformed JSON returns structured parse error', () => {
  const result = parseCountJson('{malformed json string');
  assert.equal(result.ok, false);
  assert.equal(result.error, 'JSON parse error');
  assert.ok(typeof result.message === 'string');
  recordCheck('malformed_json', 'Malformed JSON returns parse error', '{malformed json string', 'JSON parse error', result.error, true);
});

test('Contract: Unrelated programmer errors are not suppressed', () => {
  const pipeline = new JsonCounterPipeline();

  // Test that TypeError from programmer bug surfaces
  assert.throws(() => {
    pipeline.process('{"count":2}', () => {
      // Intentionally dereference null
      null.nonExistentProperty();
    });
  }, TypeError);
  recordCheck('programmer_error_surfaces', 'Programmer TypeError surfaces uncaught by catch block', 'null.deref', 'TypeError', 'TypeError surfaced', true);

  // Test that non-numeric count surfaces as TypeError
  assert.throws(() => {
    pipeline.process('{"count":"not-a-number"}');
  }, TypeError);
  recordCheck('type_error_on_invalid_count', 'Non-numeric count throws TypeError', '{"count":"not-a-number"}', 'TypeError', 'TypeError thrown', true);
});

test('Contribution focus: State invariant holds across a sequence of operations', () => {
  const pipeline = new JsonCounterPipeline();
  assert.equal(pipeline.totalCount, 0);

  // Op 1: Valid addition of 2
  const op1 = pipeline.process('{"count":2}');
  assert.equal(op1.ok, true);
  assert.equal(pipeline.totalCount, 2);
  assert.equal(pipeline.parseErrors, 0);
  recordCheck('seq_op1_valid', 'State invariant: 0 + 2 = 2', '{"count":2}', 2, pipeline.totalCount, true);

  // Op 2: Malformed JSON (must preserve totalCount == 2)
  const prevCount = pipeline.totalCount;
  const op2 = pipeline.process('{"count": broken');
  assert.equal(op2.ok, false);
  assert.equal(pipeline.totalCount, prevCount);
  assert.equal(pipeline.parseErrors, 1);
  recordCheck('seq_op2_error_preserves_state', 'State invariant preserved during parse error: totalCount remains 2', 'broken JSON', prevCount, pipeline.totalCount, true);

  // Op 3: Second valid addition of 5 (must update 2 + 5 = 7)
  const op3 = pipeline.process('{"count":5}');
  assert.equal(op3.ok, true);
  assert.equal(pipeline.totalCount, 7);
  assert.equal(pipeline.parseErrors, 1);
  assert.equal(pipeline.successfulBatches, 2);
  recordCheck('seq_op3_valid', 'State invariant: 2 + 5 = 7', '{"count":5}', 7, pipeline.totalCount, true);

  // Op 4: Surfaced error preserves state (must remain 7)
  try {
    pipeline.process('{"count":10}', () => { throw new RangeError('Test error'); });
  } catch (err) {
    assert.equal(err.message, 'Test error');
  }
  assert.equal(pipeline.totalCount, 7);
  recordCheck('seq_op4_aborted_preserves_state', 'State invariant preserved during unhandled error: totalCount remains 7', 'RangeError', 7, pipeline.totalCount, true);
});
