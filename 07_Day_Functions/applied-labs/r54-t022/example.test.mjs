/**
 * Contribution focus: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.
 *
 * Automated verification for Applied Lab (r54-t022).
 * Validates:
 *  - name=Ada, language=en gives Hello, Ada!
 *  - omitted language uses en
 *  - blank name (empty string and whitespace) is rejected
 *  - non-string types are rejected
 *  - records results in work/R54-T022/
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

const { greet, validateName, SUPPORTED_GREETINGS } = require('./example.js');

const testRecords = [];

describe('Applied Lab r54-t022: Function Defaults & Boundary Validation', () => {
  it('explicit_en_language: name=Ada, language=en gives "Hello, Ada!"', () => {
    const input = { name: 'Ada', language: 'en' };
    const expected = 'Hello, Ada!';
    const actual = greet(input.name, input.language);

    assert.strictEqual(actual, expected);

    testRecords.push({
      id: 'explicit_en_language',
      description: 'name=Ada, language=en produces "Hello, Ada!"',
      input: JSON.stringify(input),
      expected,
      actual,
      passed: actual === expected
    });
  });

  it('omitted_language_default: omitted language uses default "en"', () => {
    const input = { name: 'Ada' }; // language omitted
    const expected = 'Hello, Ada!';
    const actual = greet(input.name);

    assert.strictEqual(actual, expected);

    testRecords.push({
      id: 'omitted_language_default',
      description: 'Omitted language parameter defaults to "en"',
      input: JSON.stringify(input),
      expected,
      actual,
      passed: actual === expected
    });
  });

  it('blank_name_empty_string: empty string "" is rejected with Error', () => {
    const input = { name: '', language: 'en' };
    const expected = 'Error: Name cannot be blank';
    let actual = '';
    let passed = false;

    assert.throws(
      () => {
        greet(input.name, input.language);
      },
      (err) => {
        actual = `${err.name}: ${err.message}`;
        passed = err.name === 'Error' && err.message === 'Name cannot be blank';
        return passed;
      }
    );

    testRecords.push({
      id: 'blank_name_empty_string',
      description: 'Zero-length empty string name is rejected',
      input: JSON.stringify(input),
      expected,
      actual,
      passed
    });
  });

  it('blank_name_whitespace: whitespace-only string "   " is rejected with Error', () => {
    const input = { name: '   ', language: 'en' };
    const expected = 'Error: Name cannot be blank';
    let actual = '';
    let passed = false;

    assert.throws(
      () => {
        greet(input.name, input.language);
      },
      (err) => {
        actual = `${err.name}: ${err.message}`;
        passed = err.name === 'Error' && err.message === 'Name cannot be blank';
        return passed;
      }
    );

    testRecords.push({
      id: 'blank_name_whitespace',
      description: 'Whitespace-only string name is rejected after trimming',
      input: JSON.stringify(input),
      expected,
      actual,
      passed
    });
  });

  it('type_boundary_non_string: null and undefined names are rejected with TypeError', () => {
    let nullPassed = false;
    let undefPassed = false;

    assert.throws(
      () => greet(null),
      (err) => {
        nullPassed = err instanceof TypeError && err.message === 'Name must be a string';
        return nullPassed;
      }
    );

    assert.throws(
      () => greet(undefined),
      (err) => {
        undefPassed = err instanceof TypeError && err.message === 'Name must be a string';
        return undefPassed;
      }
    );

    const passed = nullPassed && undefPassed;
    testRecords.push({
      id: 'type_boundary_non_string',
      description: 'Non-string values (null, undefined) are rejected with TypeError',
      input: 'name = null, name = undefined',
      expected: 'TypeError: Name must be a string',
      actual: 'Both null and undefined throw TypeError as expected',
      passed
    });
  });

  it('alternate_supported_language: language=es gives "Hola, Ada!"', () => {
    const input = { name: 'Ada', language: 'es' };
    const expected = 'Hola, Ada!';
    const actual = greet(input.name, input.language);

    assert.strictEqual(actual, expected);

    testRecords.push({
      id: 'alternate_supported_language',
      description: 'Specifying alternate language code ("es") formats greeting appropriately',
      input: JSON.stringify(input),
      expected,
      actual,
      passed: actual === expected
    });
  });

  it('unsupported_language_code: unknown language code is rejected with Error', () => {
    const input = { name: 'Ada', language: 'unsupported_code' };
    let actual = '';
    let passed = false;

    assert.throws(
      () => greet(input.name, input.language),
      (err) => {
        actual = err.message;
        passed = /Unsupported language/.test(err.message);
        return passed;
      }
    );

    testRecords.push({
      id: 'unsupported_language_code',
      description: 'Unsupported language codes throw a descriptive error',
      input: JSON.stringify(input),
      expected: 'Error containing "Unsupported language"',
      actual: `Error: ${actual}`,
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

  const workDir = path.resolve(__dirname, '../../../work/R54-T022');
  fs.mkdirSync(workDir, { recursive: true });

  const resultsPayload = {
    contributionFocus: 'Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.',
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
    '# Applied Lab Check Report (R54-T022)',
    '',
    '> **Contribution focus**: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.',
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
