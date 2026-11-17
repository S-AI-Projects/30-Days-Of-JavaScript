/**
 * Contribution focus: Inject time, storage, events or network where used; use repeatable local fixtures and show that two isolated runs agree.
 *
 * Automated verification for Applied Lab (r54-t023).
 * Validates:
 *  - Updating id=2 changes only that record
 *  - Absent ID leaves the contents equivalent
 *  - Original values remain intact
 *  - Unaffected element references are strictly preserved
 *  - Two isolated runs agree with injected time and repeatable fixture
 *  - Saves results to work/R54-T023/
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

const { createDeterministicFixture, updateItemById } = require('./example.js');

const testRecords = [];
const FIXED_TIMESTAMP = '2026-11-18T00:00:00.000Z';
const mockClock = () => FIXED_TIMESTAMP;

describe('Applied Lab r54-t023: Immutable Array Update by ID', () => {
  it('update_id_2_changes_only_target: updating id=2 changes only that record', () => {
    const fixture = createDeterministicFixture();
    const updates = { name: 'Beta Updated', status: 'active', count: 99 };
    const result = updateItemById(fixture, 2, updates, { clock: mockClock });

    assert.notStrictEqual(result, fixture, 'Array container must be a new reference');
    assert.notStrictEqual(result[1], fixture[1], 'Target object must have a new reference');
    assert.strictEqual(result[1].id, 2);
    assert.strictEqual(result[1].name, 'Beta Updated');
    assert.strictEqual(result[1].status, 'active');
    assert.strictEqual(result[1].count, 99);
    assert.strictEqual(result[1].updatedAt, FIXED_TIMESTAMP);

    testRecords.push({
      id: 'update_id_2_changes_only_target',
      description: 'Updating id=2 applies updates and gives a new object reference for record 2',
      input: 'id=2, updates={ name: "Beta Updated", status: "active", count: 99 }',
      expected: 'Record id=2 updated with new fields and timestamp; new array reference',
      actual: `Record 2 updated: name="${result[1].name}", status="${result[1].status}", count=${result[1].count}`,
      passed: true
    });
  });

  it('unaffected_references_preserved: records other than id=2 retain identical memory references', () => {
    const fixture = createDeterministicFixture();
    const result = updateItemById(fixture, 2, { status: 'active' }, { clock: mockClock });

    assert.strictEqual(result[0], fixture[0], 'id=1 must preserve its exact memory reference');
    assert.strictEqual(result[2], fixture[2], 'id=3 must preserve its exact memory reference');

    testRecords.push({
      id: 'unaffected_references_preserved',
      description: 'Records not matching the target ID preserve original memory references',
      input: 'id=2, check references for id=1 and id=3',
      expected: 'result[0] === fixture[0] and result[2] === fixture[2]',
      actual: 'Both unaffected object references strictly identical (===)',
      passed: true
    });
  });

  it('original_values_remain_intact: original fixture values and array remain untouched', () => {
    const fixture = createDeterministicFixture();
    updateItemById(fixture, 2, { name: 'Mutated', status: 'changed' }, { clock: mockClock });

    assert.strictEqual(fixture[1].name, 'Beta', 'Original fixture name must remain "Beta"');
    assert.strictEqual(fixture[1].status, 'pending', 'Original fixture status must remain "pending"');
    assert.strictEqual(fixture[1].count, 20, 'Original fixture count must remain 20');

    testRecords.push({
      id: 'original_values_remain_intact',
      description: 'Original input array items remain completely unchanged after operation',
      input: 'Inspect original fixture after updateItemById call',
      expected: 'fixture[1].name === "Beta", fixture[1].status === "pending"',
      actual: `Original record 2: name="${fixture[1].name}", status="${fixture[1].status}"`,
      passed: true
    });
  });

  it('absent_id_leaves_contents_equivalent: nonexistent ID leaves array contents equivalent', () => {
    const fixture = createDeterministicFixture();
    const result = updateItemById(fixture, 999, { status: 'ghost' }, { clock: mockClock });

    assert.strictEqual(result.length, fixture.length);
    assert.deepStrictEqual(result, fixture, 'Array contents must be equivalent');
    assert.strictEqual(result[0], fixture[0]);
    assert.strictEqual(result[1], fixture[1]);
    assert.strictEqual(result[2], fixture[2]);

    testRecords.push({
      id: 'absent_id_leaves_contents_equivalent',
      description: 'Updating a nonexistent ID leaves contents equivalent and original items untouched',
      input: 'id=999 (absent from fixture)',
      expected: 'Contents equivalent to original array; all element references retained',
      actual: 'Result array deep equals original fixture; all element references identical',
      passed: true
    });
  });

  it('two_isolated_runs_agree: two separate runs with deterministic fixture and clock agree', () => {
    const fixtureA = createDeterministicFixture();
    const fixtureB = createDeterministicFixture();
    const updates = { status: 'verified', count: 50 };

    const runA = updateItemById(fixtureA, 2, updates, { clock: mockClock });
    const runB = updateItemById(fixtureB, 2, updates, { clock: mockClock });

    assert.deepStrictEqual(runA, runB, 'Outputs from two isolated runs must match identically');

    testRecords.push({
      id: 'two_isolated_runs_agree',
      description: 'Two isolated runs with deterministic fixture and injected clock produce identical output',
      input: 'Two isolated runs on separate deterministic fixtures with mockClock',
      expected: 'deepStrictEqual(runA, runB) === true',
      actual: 'Both runs produce 100% identical outputs',
      passed: true
    });
  });

  it('dependency_injection_events_and_storage: time, storage, and event handlers are injected and invoked', () => {
    const fixture = createDeterministicFixture();
    const events = [];
    let savedStorage = null;

    const storage = {
      save: (data) => {
        savedStorage = data;
      }
    };
    const onEvent = (ev) => {
      events.push(ev);
    };

    const result = updateItemById(
      fixture,
      2,
      { status: 'dispatched' },
      { clock: mockClock, storage, onEvent }
    );

    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0].type, 'ITEM_UPDATED');
    assert.strictEqual(events[0].id, 2);
    assert.strictEqual(events[0].record.status, 'dispatched');
    assert.strictEqual(savedStorage, result);

    testRecords.push({
      id: 'dependency_injection_events_and_storage',
      description: 'Injected clock, storage, and event callbacks execute predictably',
      input: 'Injected clock, storage mock, onEvent handler',
      expected: 'Event emitted with type ITEM_UPDATED; storage.save called with result',
      actual: `Events recorded: ${events.length}, Storage saved: true`,
      passed: true
    });
  });

  it('input_validation_type_error: rejects non-array first argument with TypeError', () => {
    let passed = false;
    assert.throws(
      () => updateItemById('not an array', 2, {}),
      (err) => {
        passed = err instanceof TypeError && err.message === 'First argument must be an array';
        return passed;
      }
    );

    testRecords.push({
      id: 'input_validation_type_error',
      description: 'Rejects invalid non-array input with a TypeError',
      input: 'items = "not an array"',
      expected: 'TypeError: First argument must be an array',
      actual: 'Throws TypeError as expected',
      passed
    });
  });
});

after(() => {
  const versions = {
    node: process.version,
    os: `${os.type()} ${os.release()} (${os.arch()})`,
    timestamp: new Date().toISOString()
  };

  const workDir = path.resolve(__dirname, '../../../work/R54-T023');
  fs.mkdirSync(workDir, { recursive: true });

  const resultsPayload = {
    contributionFocus: 'Inject time, storage, events or network where used; use repeatable local fixtures and show that two isolated runs agree.',
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
    '# Applied Lab Check Report (R54-T023)',
    '',
    '> **Contribution focus**: Inject time, storage, events or network where used; use repeatable local fixtures and show that two isolated runs agree.',
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
