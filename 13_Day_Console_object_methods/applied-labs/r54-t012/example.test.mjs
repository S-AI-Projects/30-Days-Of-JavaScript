import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sumItems } from './example.js';

function createSpy() {
  const events = [];
  return {
    events,
    debug(event) {
      events.push(event);
    }
  };
}

test('logger spy receives a structured event', () => {
  const spy = createSpy();
  assert.equal(sumItems([1, 2, 3], spy), 6);
  assert.deepEqual(spy.events, [{ event: 'sumItems', count: 3, total: 6 }]);
});

test('result is the same when logging is disabled', () => {
  const spy = createSpy();
  assert.equal(sumItems([1, 2, 3]), sumItems([1, 2, 3], spy));
  assert.equal(sumItems([1, 2, 3], null), 6);
});

test('empty array is the lower boundary', () => {
  const spy = createSpy();
  assert.equal(sumItems([], spy), 0);
  assert.deepEqual(spy.events, [{ event: 'sumItems', count: 0, total: 0 }]);
});

test('input that is not an array throws and logs nothing', () => {
  const spy = createSpy();
  assert.throws(() => sumItems('123', spy), TypeError);
  assert.throws(() => sumItems(undefined, spy), TypeError);
  assert.equal(spy.events.length, 0);
});
