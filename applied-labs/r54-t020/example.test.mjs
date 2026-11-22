import assert from 'node:assert/strict';
import { test } from 'node:test';
import { summarize } from './example.js';

function countReads(values) {
  const counter = { reads: 0 };
  const proxy = new Proxy(values, {
    get(target, key, receiver) {
      if (typeof key === 'string' && /^\d+$/.test(key)) counter.reads += 1;
      return Reflect.get(target, key, receiver);
    }
  });
  return { proxy, counter };
}

test('[2, 4, 6] gives sum 12 and average 4', () => {
  assert.deepEqual(summarize([2, 4, 6]), { sum: 12, average: 4 });
});

test('empty array and non-number items are rejected', () => {
  assert.throws(() => summarize([]));
  assert.throws(() => summarize([1, '2', 3]), TypeError);
  assert.throws(() => summarize([1, NaN]), TypeError);
  assert.throws(() => summarize('123'));
});

for (const size of [10, 100, 1000]) {
  test(`input of ${size} numbers is correct and read once`, t => {
    const values = Array.from({ length: size }, (_, index) => index + 1);
    const { proxy, counter } = countReads(values);
    const result = summarize(proxy);
    assert.equal(result.sum, (size * (size + 1)) / 2);
    assert.equal(result.average, (size + 1) / 2);
    assert.equal(counter.reads, size);
    t.diagnostic(`size ${size}: ${counter.reads} element reads`);
  });
}
