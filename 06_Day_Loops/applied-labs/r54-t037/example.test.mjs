import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import { countConsecutiveSymbols, traceConsecutiveSymbols } from './example.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workDir = path.resolve(__dirname, '../../../work/R54-T037');

const testRecords = [];

function recordCheck(id, description, input, expected, actual, passed) {
  testRecords.push({ id, description, input, expected, actual, passed });
}

test.after(() => {
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  const resultsJson = {
    taskId: 'R54-T037',
    student: 'Anushka Jaiswal',
    contributionFocus: 'Add a worked explanation from input through intermediate state to output, and make the published example executable by the test.',
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
  const markdown = `# Applied Lab Check Report (R54-T037)

> **Contribution focus**: Add a worked explanation from input through intermediate state to output, and make the published example executable by the test.

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

test('Count consecutive symbols in standard input "aaabbc"', () => {
  const result = countConsecutiveSymbols('aaabbc');
  const expected = [
    { symbol: 'a', count: 3 },
    { symbol: 'b', count: 2 },
    { symbol: 'c', count: 1 }
  ];
  assert.deepEqual(result, expected);
  recordCheck('count_aaabbc', 'Counts "aaabbc" correctly', 'aaabbc', expected, result, true);
});

test('Empty string yields empty array []', () => {
  const result = countConsecutiveSymbols('');
  const expected = [];
  assert.deepEqual(result, expected);
  recordCheck('count_empty', 'Empty string produces empty array', '', expected, result, true);
});

test('Single symbol and alternating symbols', () => {
  const single = countConsecutiveSymbols('zzzz');
  const expectedSingle = [{ symbol: 'z', count: 4 }];
  assert.deepEqual(single, expectedSingle);
  recordCheck('count_single_repeat', 'Single repeating character', 'zzzz', expectedSingle, single, true);

  const alternating = countConsecutiveSymbols('abab');
  const expectedAlt = [
    { symbol: 'a', count: 1 },
    { symbol: 'b', count: 1 },
    { symbol: 'a', count: 1 },
    { symbol: 'b', count: 1 }
  ];
  assert.deepEqual(alternating, expectedAlt);
  recordCheck('count_alternating', 'Alternating symbols', 'abab', expectedAlt, alternating, true);
});

test('Contribution focus: Worked explanation traces input through intermediate state to output', () => {
  const trace = traceConsecutiveSymbols('aaabbc');
  assert.equal(trace.input, 'aaabbc');
  assert.ok(Array.isArray(trace.intermediateStates));
  assert.ok(trace.intermediateStates.length > 0);

  // Validate initialization step
  const init = trace.intermediateStates[0];
  assert.equal(init.action, 'initialize');
  assert.equal(init.currentSymbol, 'a');
  assert.equal(init.currentCount, 1);

  // Validate intermediate flush step
  const flushStep = trace.intermediateStates.find(s => s.action === 'flush_and_reset' && s.char === 'b');
  assert.ok(flushStep);
  assert.equal(flushStep.previousSymbol, 'a');
  assert.equal(flushStep.previousCount, 3);
  assert.equal(flushStep.currentSymbol, 'b');

  // Validate output match
  const expectedOutput = [
    { symbol: 'a', count: 3 },
    { symbol: 'b', count: 2 },
    { symbol: 'c', count: 1 }
  ];
  assert.deepEqual(trace.output, expectedOutput);
  recordCheck('worked_explanation_trace', 'Intermediate trace connects input to output', 'aaabbc', expectedOutput, trace.output, true);
});
