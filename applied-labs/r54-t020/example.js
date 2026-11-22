export function summarize(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('numbers must be a nonempty array');
  }
  let sum = 0;
  for (const value of numbers) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new TypeError('every item must be a number');
    }
    sum += value;
  }
  return { sum, average: sum / numbers.length };
}
