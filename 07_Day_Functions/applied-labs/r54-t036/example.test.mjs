import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import { greetInitial, resolveSalutation, validateName, greet } from './example.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workDir = path.resolve(__dirname, '../../../work/R54-T036');

const testRecords = [];

function recordCheck(id, description, input, expected, actual, passed) {
  testRecords.push({ id, description, input, expected, actual, passed });
}

test.after(() => {
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }

  const resultsJson = {
    taskId: 'R54-T036',
    student: 'Anushka Jaiswal',
    contributionFocus: 'Start from a working version, capture its behavior and extract one clearly named responsibility without changing the contract.',
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
  const markdown = `# Applied Lab Check Report (R54-T036)

> **Contribution focus**: Start from a working version, capture its behavior and extract one clearly named responsibility without changing the contract.

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

test('Contract: name="Ada", language="en" gives "Hello, Ada!"', () => {
  const result = greet('Ada', 'en');
  const expected = 'Hello, Ada!';
  assert.equal(result, expected);
  recordCheck('greet_ada_en', 'Explicit name and language', { name: 'Ada', language: 'en' }, expected, result, true);
});

test('Contract: omitted language uses default "en"', () => {
  const result = greet('Ada');
  const expected = 'Hello, Ada!';
  assert.equal(result, expected);
  recordCheck('greet_ada_default', 'Omitted language uses default en', { name: 'Ada' }, expected, result, true);

  const resultUndefined = greet('Ada', undefined);
  assert.equal(resultUndefined, expected);
  recordCheck('greet_ada_undefined', 'Explicit undefined language uses default en', { name: 'Ada', language: undefined }, expected, resultUndefined, true);
});

test('Contract: blank name is rejected', () => {
  assert.throws(() => greet(''), /Name cannot be blank/);
  recordCheck('reject_empty_string', 'Empty string rejected', { name: '' }, 'Error: Name cannot be blank', 'Error thrown', true);

  assert.throws(() => greet('   '), /Name cannot be blank/);
  recordCheck('reject_whitespace', 'Whitespace-only name rejected', { name: '   ' }, 'Error: Name cannot be blank', 'Error thrown', true);

  assert.throws(() => greet(null), /Name cannot be blank/);
  recordCheck('reject_null', 'Null name rejected', { name: null }, 'Error: Name cannot be blank', 'Error thrown', true);

  assert.throws(() => greet(undefined), /Name cannot be blank/);
  recordCheck('reject_undefined', 'Undefined name rejected', { name: undefined }, 'Error: Name cannot be blank', 'Error thrown', true);
});

test('Contribution focus: Refactored function preserves exact contract of initial working version', () => {
  const testCases = [
    { name: 'Ada', language: 'en' },
    { name: 'Grace', language: undefined },
    { name: 'Alan', language: 'fr' },
    { name: 'Margaret', language: 'de' }
  ];

  for (const tc of testCases) {
    const initialOut = greetInitial(tc.name, tc.language);
    const refactoredOut = greet(tc.name, tc.language);
    assert.equal(refactoredOut, initialOut);
    recordCheck(`parity_${tc.name}`, `Parity check for ${tc.name}`, tc, initialOut, refactoredOut, true);
  }

  // Check extracted helper resolveSalutation
  assert.equal(resolveSalutation('en'), 'Hello');
  assert.equal(resolveSalutation('es'), '¡Hola');
  assert.equal(resolveSalutation(), 'Hello');
  recordCheck('helper_resolveSalutation', 'Extracted resolveSalutation helper functions correctly', 'es', '¡Hola', resolveSalutation('es'), true);

  // Check extracted helper validateName
  assert.equal(validateName('  Ada  '), 'Ada');
  recordCheck('helper_validateName', 'Extracted validateName trims string correctly', '  Ada  ', 'Ada', validateName('  Ada  '), true);
});
