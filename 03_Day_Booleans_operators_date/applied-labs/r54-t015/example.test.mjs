import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { canEdit } from './example.js';

const dir = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(readFileSync(new URL('./fixture.json', import.meta.url), 'utf8'));
const expected = cases.map(item => item.expected);

const script = `
import { readFileSync } from 'node:fs';
import { canEdit } from './example.js';
const cases = JSON.parse(readFileSync('./fixture.json', 'utf8'));
console.log(JSON.stringify(cases.map(item => canEdit(item.user, item.post))));
`;

function isolatedRun() {
  const output = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: dir,
    encoding: 'utf8'
  });
  return JSON.parse(output);
}

test('authenticated owner succeeds', () => {
  assert.equal(canEdit(cases[0].user, cases[0].post), true);
});

test('authenticated user who is not owner or admin fails', () => {
  assert.equal(canEdit(cases[1].user, cases[1].post), false);
});

test('unauthenticated admin fails', () => {
  assert.equal(canEdit(cases[2].user, cases[2].post), false);
});

test('every fixture case matches the expected value', () => {
  assert.deepEqual(cases.map(item => canEdit(item.user, item.post)), expected);
});

test('two isolated runs agree', () => {
  const first = isolatedRun();
  const second = isolatedRun();
  assert.deepEqual(first, second);
  assert.deepEqual(first, expected);
});
