import assert from 'node:assert/strict';
import { test } from 'node:test';
import { replaceById } from './example.js';

const makeItems = () => [
  { id: 1, name: 'pen' },
  { id: 2, name: 'book' },
  { id: 3, name: 'bag' }
];

function referenceReplace(items, id, replacement) {
  const copy = [];
  for (const item of items) {
    copy.push(item.id === id ? replacement : item);
  }
  return copy;
}

const table = [
  {
    id: 2,
    next: { id: 2, name: 'notebook' },
    expected: [{ id: 1, name: 'pen' }, { id: 2, name: 'notebook' }, { id: 3, name: 'bag' }]
  },
  {
    id: 1,
    next: { id: 1, name: 'marker' },
    expected: [{ id: 1, name: 'marker' }, { id: 2, name: 'book' }, { id: 3, name: 'bag' }]
  },
  {
    id: 9,
    next: { id: 9, name: 'lamp' },
    expected: makeItems()
  }
];

test('results match the expected table and the reference version', () => {
  for (const { id, next, expected } of table) {
    const items = makeItems();
    const result = replaceById(items, id, next);
    assert.deepEqual(result, expected);
    assert.deepEqual(result, referenceReplace(items, id, next));
  }
});

test('original array and its values stay intact', () => {
  const items = makeItems();
  replaceById(items, 2, { id: 2, name: 'notebook' });
  assert.deepEqual(items, makeItems());
});

test('other records keep their references', () => {
  const items = makeItems();
  const result = replaceById(items, 2, { id: 2, name: 'notebook' });
  assert.notEqual(result, items);
  assert.equal(result[0], items[0]);
  assert.equal(result[2], items[2]);
  assert.notEqual(result[1], items[1]);
});

test('absent id gives equal contents in a new array', () => {
  const items = makeItems();
  const result = replaceById(items, 9, { id: 9, name: 'lamp' });
  assert.notEqual(result, items);
  assert.deepEqual(result, items);
});
