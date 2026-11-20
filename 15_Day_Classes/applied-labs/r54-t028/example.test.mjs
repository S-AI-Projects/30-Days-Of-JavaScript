/**
 * Automated Verification for Applied Lab (r54-t028)
 *
 * Task: R54-T028 · 8 of 10
 * Topic: Day 15 — Classes (Class State & Regression-Focused Lab)
 * Contribution focus: Create a temporary one-line mutant of the decisive condition;
 * add a focused test that passes on the correct example and fails on that mutant.
 *
 * Requirements:
 *  - Increment A twice gives 2; B remains 0; reset A gives 0.
 *  - Independent instances verified.
 *  - Focused test passes on correct Counter and fails on MutantCounter.
 *  - Records results in work/R54-T028/
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

const { Counter, MutantCounter, runCounterWorkflow } = require('./example.js');

const testRecords = [];

describe('Applied Lab r54-t028: Class State & Regression Testing', () => {
  it('independent_instances_increment: incrementing A twice gives 2 while B remains 0', () => {
    const a = new Counter(0);
    const b = new Counter(0);

    assert.strictEqual(a.count, 0, 'Initial A count must be 0');
    assert.strictEqual(b.count, 0, 'Initial B count must be 0');

    a.increment();
    a.increment();

    assert.strictEqual(a.count, 2, 'Incrementing A twice must result in count=2');
    assert.strictEqual(b.count, 0, 'Counter B must remain unaffected with count=0');

    testRecords.push({
      id: 'T01-INDEPENDENT-INSTANCES-INCREMENT',
      description: 'Incrementing instance A twice gives 2 while instance B remains 0',
      input: 'new Counter() for A and B; a.increment() twice',
      expected: 'a.count === 2 && b.count === 0',
      actual: `a.count = ${a.count}, b.count = ${b.count}`,
      passed: a.count === 2 && b.count === 0
    });
  });

  it('reset_counter_a: resetting A restores count to 0 while B remains 0', () => {
    const a = new Counter(0);
    const b = new Counter(0);

    a.increment();
    a.increment();
    assert.strictEqual(a.count, 2);

    a.reset();

    assert.strictEqual(a.count, 0, 'Resetting A must restore count to 0');
    assert.strictEqual(b.count, 0, 'Counter B must remain 0 after A is reset');

    testRecords.push({
      id: 'T02-RESET-COUNTER-A',
      description: 'Resetting Counter A sets count to 0 while Counter B remains 0',
      input: 'a.increment() x2; a.reset()',
      expected: 'a.count === 0 && b.count === 0',
      actual: `a.count = ${a.count}, b.count = ${b.count}`,
      passed: a.count === 0 && b.count === 0
    });
  });

  it('workflow_fixture: full workflow matches exact contract specification', () => {
    const result = runCounterWorkflow(Counter);

    assert.strictEqual(result.aCountAfterIncrement, 2, 'A after 2 increments must be 2');
    assert.strictEqual(result.bCountAfterIncrement, 0, 'B after A increments must be 0');
    assert.strictEqual(result.aCountAfterReset, 0, 'A after reset must be 0');
    assert.strictEqual(result.bCountAfterReset, 0, 'B after A reset must be 0');

    testRecords.push({
      id: 'T03-WORKFLOW-FIXTURE',
      description: 'Workflow fixture asserts A=2, B=0 after increments, and A=0, B=0 after reset',
      input: 'runCounterWorkflow(Counter)',
      expected: 'aInc=2, bInc=0, aReset=0, bReset=0',
      actual: `aInc=${result.aCountAfterIncrement}, bInc=${result.bCountAfterIncrement}, aReset=${result.aCountAfterReset}, bReset=${result.bCountAfterReset}`,
      passed: result.aCountAfterIncrement === 2 &&
              result.bCountAfterIncrement === 0 &&
              result.aCountAfterReset === 0 &&
              result.bCountAfterReset === 0
    });
  });

  it('decisive_condition_mutant: test passes on correct Counter and fails on MutantCounter', () => {
    // 1. Verify correct implementation passes
    const correctResult = runCounterWorkflow(Counter);
    assert.strictEqual(
      correctResult.aCountAfterReset,
      0,
      'Correct Counter must reset to 0'
    );

    // 2. Verify mutant fails the decisive reset condition
    const mutantResult = runCounterWorkflow(MutantCounter);
    assert.notStrictEqual(
      mutantResult.aCountAfterReset,
      0,
      'MutantCounter must fail to reset because decisive condition is inverted'
    );
    assert.strictEqual(
      mutantResult.aCountAfterReset,
      2,
      'MutantCounter retains count=2 due to decisive condition failure'
    );

    // Demonstrate the failure detection
    let mutantThrewOrFailed = false;
    try {
      assert.strictEqual(mutantResult.aCountAfterReset, 0);
    } catch {
      mutantThrewOrFailed = true;
    }
    assert.strictEqual(mutantThrewOrFailed, true, 'Assertion must fail on MutantCounter');

    testRecords.push({
      id: 'T04-DECISIVE-CONDITION-MUTANT',
      description: 'Focused test passes on correct Counter (aReset=0) and fails on MutantCounter (aReset=2)',
      input: 'runCounterWorkflow(Counter) vs runCounterWorkflow(MutantCounter)',
      expected: 'Counter passes (aReset=0); MutantCounter fails assertion (aReset=2)',
      actual: `Counter: aReset=${correctResult.aCountAfterReset} (PASS); Mutant: aReset=${mutantResult.aCountAfterReset} (FAILS condition as expected)`,
      passed: correctResult.aCountAfterReset === 0 && mutantResult.aCountAfterReset === 2 && mutantThrewOrFailed
    });
  });

  it('custom_initial_value_and_step: supports custom initial values and steps', () => {
    const c = new Counter(10);
    assert.strictEqual(c.count, 10);
    assert.strictEqual(c.initialValue, 10);

    c.increment(5);
    assert.strictEqual(c.count, 15);

    c.reset();
    assert.strictEqual(c.count, 10);

    testRecords.push({
      id: 'T05-CUSTOM-INITIAL-VALUE-AND-STEP',
      description: 'Counter supports custom initial value and step, resetting back to custom initial value',
      input: 'new Counter(10); c.increment(5); c.reset()',
      expected: 'Initial 10 -> increment(5) gives 15 -> reset() gives 10',
      actual: `count after reset = ${c.count}`,
      passed: c.count === 10
    });
  });

  after(() => {
    const versions = {
      node: process.version,
      os: `${os.type()} ${os.release()} (${os.arch()})`,
      timestamp: new Date().toISOString()
    };

    const workDir = path.resolve(__dirname, '../../../work/R54-T028');
    fs.mkdirSync(workDir, { recursive: true });

    const resultsPayload = {
      contributionFocus: 'Create a temporary one-line mutant of the decisive condition; add a focused test that passes on the correct example and fails on that mutant.',
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
      '# Applied Lab Check Report (R54-T028)',
      '',
      '> **Contribution focus**: Create a temporary one-line mutant of the decisive condition; add a focused test that passes on the correct example and fails on that mutant.',
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
