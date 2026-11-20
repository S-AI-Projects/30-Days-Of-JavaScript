/**
 * Automated Verification for Applied Lab (r54-t030)
 *
 * Task: R54-T030 · 10 of 10
 * Topic: Day 6 — Loops (Consecutive Symbol Counter & Reference Comparison)
 * Contribution focus: Provide a small independent expected-result table or simpler
 * reference implementation for the defined behavior; compare against it.
 *
 * Requirements:
 *  - "aaabbc" -> [{symbol:a,count:3},{symbol:b,count:2},{symbol:c,count:1}]
 *  - empty string -> []
 *  - Comparison against independent expected-result table
 *  - Comparison against simpler reference implementation
 *  - Records results in work/R54-T030/
 */

import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  countConsecutiveSymbols,
  referenceCountConsecutive,
  EXPECTED_RESULTS_TABLE
} = require('./example.js');

const testRecords = [];

describe('Applied Lab r54-t030: Consecutive Symbol Counter & Reference Comparison', () => {
  it('contract_primary_fixture: "aaabbc" produces expected runs', () => {
    const input = 'aaabbc';
    const actual = countConsecutiveSymbols(input);
    const expected = [
      { symbol: 'a', count: 3 },
      { symbol: 'b', count: 2 },
      { symbol: 'c', count: 1 }
    ];

    assert.deepStrictEqual(actual, expected, 'Result must match exact contract specification');

    testRecords.push({
      id: 'T01-CONTRACT-PRIMARY-FIXTURE',
      description: 'Counting "aaabbc" returns [{symbol:a,count:3},{symbol:b,count:2},{symbol:c,count:1}]',
      input: '"aaabbc"',
      expected: JSON.stringify(expected),
      actual: JSON.stringify(actual),
      passed: JSON.stringify(actual) === JSON.stringify(expected)
    });
  });

  it('contract_empty_string: empty string returns empty array', () => {
    const input = '';
    const actual = countConsecutiveSymbols(input);
    const expected = [];

    assert.deepStrictEqual(actual, expected, 'Empty string must return empty array');

    testRecords.push({
      id: 'T02-CONTRACT-EMPTY-STRING',
      description: 'Counting empty string "" returns []',
      input: '""',
      expected: '[]',
      actual: JSON.stringify(actual),
      passed: actual.length === 0
    });
  });

  it('expected_result_table_comparison: explicit loop matches all cases in independent expected-result table', () => {
    let allMatched = true;

    for (const testCase of EXPECTED_RESULTS_TABLE) {
      const actual = countConsecutiveSymbols(testCase.input);
      assert.deepStrictEqual(
        actual,
        testCase.expected,
        `Mismatch for input "${testCase.input}" (${testCase.description})`
      );
    }

    testRecords.push({
      id: 'T03-EXPECTED-RESULT-TABLE-COMPARISON',
      description: 'Explicit loop implementation matches all 5 entries in independent expected-result table',
      input: `${EXPECTED_RESULTS_TABLE.length} table fixture cases`,
      expected: '100% agreement with EXPECTED_RESULTS_TABLE',
      actual: `All ${EXPECTED_RESULTS_TABLE.length} test cases matched perfectly: true`,
      passed: allMatched
    });
  });

  it('reference_implementation_comparison: explicit loop agrees with regex reference implementation', () => {
    const testCases = [
      'aaabbc',
      '',
      'a',
      'zzzzzz',
      'abcde',
      'mississippi',
      '$$$$####@@',
      '111222333444555'
    ];

    let allMatched = true;
    for (const str of testCases) {
      const loopResult = countConsecutiveSymbols(str);
      const refResult = referenceCountConsecutive(str);

      assert.deepStrictEqual(
        loopResult,
        refResult,
        `Loop result diverged from reference implementation for "${str}"`
      );
    }

    testRecords.push({
      id: 'T04-REFERENCE-IMPLEMENTATION-COMPARISON',
      description: 'Explicit loop agrees identically with simpler regex reference implementation across varied inputs',
      input: `${testCases.length} diverse strings`,
      expected: 'countConsecutiveSymbols(s) === referenceCountConsecutive(s)',
      actual: `All ${testCases.length} strings produced identical results: true`,
      passed: allMatched
    });
  });

  it('edge_cases_and_non_string: gracefully handles non-string or single-character inputs', () => {
    assert.deepStrictEqual(countConsecutiveSymbols(null), []);
    assert.deepStrictEqual(countConsecutiveSymbols(undefined), []);
    assert.deepStrictEqual(countConsecutiveSymbols(12345), []);
    assert.deepStrictEqual(countConsecutiveSymbols('z'), [{ symbol: 'z', count: 1 }]);

    testRecords.push({
      id: 'T05-EDGE-CASES-AND-NON-STRING',
      description: 'Gracefully returns [] for non-string inputs and correctly handles single-char string',
      input: 'null, undefined, 12345, "z"',
      expected: '[], [], [], [{ symbol: "z", count: 1 }]',
      actual: 'All edge cases returned expected output',
      passed: true
    });
  });

  after(() => {
    const versions = {
      node: process.version,
      os: `${os.type()} ${os.release()} (${os.arch()})`,
      timestamp: new Date().toISOString()
    };

    const workDir = path.resolve(__dirname, '../../../work/R54-T030');
    fs.mkdirSync(workDir, { recursive: true });

    const resultsPayload = {
      contributionFocus: 'Provide a small independent expected-result table or simpler reference implementation for the defined behavior; compare against it.',
      toolVersions: versions,
      summary: {
        totalTests: testRecords.length,
        passed: testRecords.filter((t) => t.passed).length,
        failed: testRecords.filter((t) => !t.passed).length
      },
      tests: testRecords
    };

    fs.writeFileSync(
      path.join(workDir, 'results.json'),
      JSON.stringify(resultsPayload, null, 2),
      'utf8'
    );

    const markdownReport = [
      '# Applied Lab Check Report (R54-T030)',
      '',
      '> **Contribution focus**: Provide a small independent expected-result table or simpler reference implementation for the defined behavior; compare against it.',
      '',
      '## Tool Versions',
      `- **Node.js**: ${versions.node}`,
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
    console.log(`\nResults saved to ${workDir}/results.json and results.md`);
  });
});
