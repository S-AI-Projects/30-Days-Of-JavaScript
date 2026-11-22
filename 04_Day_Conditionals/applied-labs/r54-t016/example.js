function assertValidScore(score) {
  if (typeof score !== 'number' || Number.isNaN(score) || score < 0 || score > 100) {
    throw new RangeError('score must be a number from 0 to 100');
  }
}

export function classifyScore(score) {
  assertValidScore(score);
  if (score < 40) return 'fail';
  if (score < 75) return 'pass';
  return 'distinction';
}
