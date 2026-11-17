/**
 * Contribution focus: State and test the invariant connecting input/state to output across a short sequence of operations.
 *
 * Automated verification for Applied Lab (r54-t024).
 * Validates:
 *  - defaults {limit:10,enabled:true}, overrides {limit:0,enabled:false} preserves both overrides
 *  - State invariant across a sequence of operations
 *  - Preservation of falsy values (0, false, "")
 *  - Saves results to work/R54-T024/
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

const { mergeConfig, ConfigManager } = require('./example.js');

const testRecords = [];

describe('Applied Lab r54-t024: Destructured Configuration & State Invariant', () => {
  it('falsy_overrides_preservation: preserves limit=0 and enabled=false overrides', () => {
    const defaults = { limit: 10, enabled: true };
    const overrides = { limit: 0, enabled: false };
    const result = mergeConfig(defaults, overrides);

    assert.strictEqual(result.limit, 0, 'Override limit=0 must be preserved');
    assert.strictEqual(result.enabled, false, 'Override enabled=false must be preserved');

    testRecords.push({
      id: 'falsy_overrides_preservation',
      description: 'defaults {limit:10,enabled:true}, overrides {limit:0,enabled:false} preserves both overrides',
      input: `defaults=${JSON.stringify(defaults)}, overrides=${JSON.stringify(overrides)}`,
      expected: JSON.stringify({ limit: 0, enabled: false }),
      actual: JSON.stringify(result),
      passed: result.limit === 0 && result.enabled === false
    });
  });

  it('empty_string_and_null_preservation: preserves empty string and null overrides', () => {
    const defaults = { prefix: 'default_', handler: 'defaultHandler' };
    const overrides = { prefix: '', handler: null };
    const result = mergeConfig(defaults, overrides);

    assert.strictEqual(result.prefix, '', 'Empty string override must be preserved');
    assert.strictEqual(result.handler, null, 'Null override must be preserved');

    testRecords.push({
      id: 'empty_string_and_null_preservation',
      description: 'Preserves empty string and null overrides without defaulting',
      input: `defaults=${JSON.stringify(defaults)}, overrides=${JSON.stringify(overrides)}`,
      expected: JSON.stringify({ prefix: '', handler: null }),
      actual: JSON.stringify(result),
      passed: result.prefix === '' && result.handler === null
    });
  });

  it('unspecified_keys_retain_defaults: omitted override keys retain default values', () => {
    const defaults = { limit: 10, enabled: true, timeout: 5000 };
    const overrides = { limit: 50 }; // enabled and timeout omitted
    const result = mergeConfig(defaults, overrides);

    assert.strictEqual(result.limit, 50);
    assert.strictEqual(result.enabled, true);
    assert.strictEqual(result.timeout, 5000);

    testRecords.push({
      id: 'unspecified_keys_retain_defaults',
      description: 'Omitted keys in overrides retain their initial default values',
      input: 'defaults={limit:10,enabled:true,timeout:5000}, overrides={limit:50}',
      expected: JSON.stringify({ limit: 50, enabled: true, timeout: 5000 }),
      actual: JSON.stringify(result),
      passed: result.limit === 50 && result.enabled === true && result.timeout === 5000
    });
  });

  it('state_invariant_sequence_step_1: initial state to {limit: 0, enabled: false}', () => {
    const manager = new ConfigManager({ limit: 10, enabled: true, timeout: 5000 });
    const priorState = manager.getState();
    const op = { limit: 0, enabled: false };
    const nextState = manager.update(op);

    const verification = ConfigManager.verifyInvariant(priorState, op, nextState);
    assert.strictEqual(verification.holds, true, verification.violations.join(', '));
    assert.strictEqual(nextState.limit, 0);
    assert.strictEqual(nextState.enabled, false);
    assert.strictEqual(nextState.timeout, 5000);

    testRecords.push({
      id: 'state_invariant_sequence_step_1',
      description: 'State invariant holds for operation 1: update {limit: 0, enabled: false}',
      input: `prior=${JSON.stringify(priorState)}, op=${JSON.stringify(op)}`,
      expected: 'Invariant holds: limit=0, enabled=false, timeout=5000',
      actual: `Invariant holds: limit=${nextState.limit}, enabled=${nextState.enabled}, timeout=${nextState.timeout}`,
      passed: verification.holds
    });
  });

  it('state_invariant_sequence_step_2: update {timeout: 0} preserves previous falsy values', () => {
    const manager = new ConfigManager({ limit: 10, enabled: true, timeout: 5000 });
    manager.update({ limit: 0, enabled: false });

    const priorState = manager.getState();
    const op = { timeout: 0 };
    const nextState = manager.update(op);

    const verification = ConfigManager.verifyInvariant(priorState, op, nextState);
    assert.strictEqual(verification.holds, true, verification.violations.join(', '));
    assert.strictEqual(nextState.limit, 0, 'Prior falsy limit=0 must persist');
    assert.strictEqual(nextState.enabled, false, 'Prior falsy enabled=false must persist');
    assert.strictEqual(nextState.timeout, 0, 'New falsy timeout=0 must apply');

    testRecords.push({
      id: 'state_invariant_sequence_step_2',
      description: 'State invariant holds for operation 2: update {timeout: 0} while preserving prior state',
      input: `prior=${JSON.stringify(priorState)}, op=${JSON.stringify(op)}`,
      expected: 'Invariant holds: limit=0, enabled=false, timeout=0',
      actual: `Invariant holds: limit=${nextState.limit}, enabled=${nextState.enabled}, timeout=${nextState.timeout}`,
      passed: verification.holds
    });
  });

  it('state_invariant_sequence_step_3: update {enabled: true} toggles boolean while retaining numeric 0', () => {
    const manager = new ConfigManager({ limit: 10, enabled: true, timeout: 5000 });
    manager.update({ limit: 0, enabled: false });
    manager.update({ timeout: 0 });

    const priorState = manager.getState();
    const op = { enabled: true };
    const nextState = manager.update(op);

    const verification = ConfigManager.verifyInvariant(priorState, op, nextState);
    assert.strictEqual(verification.holds, true, verification.violations.join(', '));
    assert.strictEqual(nextState.limit, 0, 'limit=0 must persist');
    assert.strictEqual(nextState.enabled, true, 'enabled=true must apply');
    assert.strictEqual(nextState.timeout, 0, 'timeout=0 must persist');

    testRecords.push({
      id: 'state_invariant_sequence_step_3',
      description: 'State invariant holds for operation 3: update {enabled: true} while retaining numeric zeros',
      input: `prior=${JSON.stringify(priorState)}, op=${JSON.stringify(op)}`,
      expected: 'Invariant holds: limit=0, enabled=true, timeout=0',
      actual: `Invariant holds: limit=${nextState.limit}, enabled=${nextState.enabled}, timeout=${nextState.timeout}`,
      passed: verification.holds
    });
  });

  it('input_validation_type_error: rejects invalid non-object parameters with TypeError', () => {
    let defaultsPassed = false;
    let overridesPassed = false;

    assert.throws(
      () => mergeConfig(null, {}),
      (err) => {
        defaultsPassed = err instanceof TypeError && err.message.includes('Defaults must be a non-null object');
        return defaultsPassed;
      }
    );

    assert.throws(
      () => mergeConfig({}, null),
      (err) => {
        overridesPassed = err instanceof TypeError && err.message.includes('Overrides must be a non-null object');
        return overridesPassed;
      }
    );

    testRecords.push({
      id: 'input_validation_type_error',
      description: 'Rejects non-object defaults or overrides with TypeError',
      input: 'mergeConfig(null, {}), mergeConfig({}, null)',
      expected: 'TypeError thrown for both invalid arguments',
      actual: 'Both throw TypeError as expected',
      passed: defaultsPassed && overridesPassed
    });
  });
});

after(() => {
  const versions = {
    node: process.version,
    os: `${os.type()} ${os.release()} (${os.arch()})`,
    timestamp: new Date().toISOString()
  };

  const workDir = path.resolve(__dirname, '../../../work/R54-T024');
  fs.mkdirSync(workDir, { recursive: true });

  const resultsPayload = {
    contributionFocus: 'State and test the invariant connecting input/state to output across a short sequence of operations.',
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
    '# Applied Lab Check Report (R54-T024)',
    '',
    '> **Contribution focus**: State and test the invariant connecting input/state to output across a short sequence of operations.',
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
