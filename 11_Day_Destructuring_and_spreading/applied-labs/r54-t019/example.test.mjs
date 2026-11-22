import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mergeConfig } from './example.js';

function mutantMerge(defaults, overrides = {}) {
  const result = { ...defaults };
  for (const key of Object.keys(overrides)) {
    if (overrides[key]) result[key] = overrides[key];
  }
  return result;
}

function assertFalsyOverridesKept(merge) {
  const defaults = { limit: 10, enabled: true };
  const overrides = { limit: 0, enabled: false };
  assert.deepEqual(merge(defaults, overrides), { limit: 0, enabled: false });
}

test('0 and false overrides are preserved', () => {
  assertFalsyOverridesKept(mergeConfig);
});

test('the same check fails on the mutant', () => {
  assert.throws(() => assertFalsyOverridesKept(mutantMerge), assert.AssertionError);
});

test('defaults fill in missing keys', () => {
  assert.deepEqual(mergeConfig({ limit: 10, enabled: true }, { limit: 5 }), { limit: 5, enabled: true });
  assert.deepEqual(mergeConfig({ limit: 10, enabled: true }), { limit: 10, enabled: true });
});

test('inputs are not changed', () => {
  const defaults = { limit: 10, enabled: true };
  const overrides = { limit: 0 };
  mergeConfig(defaults, overrides);
  assert.deepEqual(defaults, { limit: 10, enabled: true });
  assert.deepEqual(overrides, { limit: 0 });
});
