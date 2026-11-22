import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyScore } from './example.js';

function originalClassify(score) {
  if (typeof score !== 'number' || Number.isNaN(score) || score < 0 || score > 100) {
    throw new RangeError('score must be a number from 0 to 100');
  }
  if (score < 40) return 'fail';
  if (score < 75) return 'pass';
  return 'distinction';
}

function outcome(fn, score) {
  try {
    return fn(score);
  } catch (error) {
    return error.name;
  }
}

test('boundary scores', () => {
  assert.equal(classifyScore(39), 'fail');
  assert.equal(classifyScore(40), 'pass');
  assert.equal(classifyScore(74), 'pass');
  assert.equal(classifyScore(75), 'distinction');
  assert.equal(classifyScore(0), 'fail');
  assert.equal(classifyScore(100), 'distinction');
});

test('scores outside 0 to 100 are rejected', () => {
  assert.throws(() => classifyScore(-1), RangeError);
  assert.throws(() => classifyScore(101), RangeError);
  assert.throws(() => classifyScore(NaN), RangeError);
  assert.throws(() => classifyScore('50'), RangeError);
});

test('refactored version behaves like the original for every score', () => {
  const scores = [];
  for (let score = -5; score <= 105; score += 0.5) scores.push(score);
  for (const score of scores) {
    assert.equal(outcome(classifyScore, score), outcome(originalClassify, score));
  }
});
