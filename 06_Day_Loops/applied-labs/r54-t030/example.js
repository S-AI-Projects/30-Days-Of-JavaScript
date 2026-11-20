/**
 * Day 6: Loops — Consecutive Symbol Counter & Reference Comparison Lab
 *
 * Task: R54-T030 · 10 of 10
 * Contribution focus: Provide a small independent expected-result table or simpler
 * reference implementation for the defined behavior; compare against it.
 *
 * Contract:
 *  - Count consecutive occurrences of symbols using an explicit loop.
 *  - "aaabbc" -> [{ symbol: 'a', count: 3 }, { symbol: 'b', count: 2 }, { symbol: 'c', count: 1 }]
 *  - "" -> []
 *  - Independent expected-result table provided.
 *  - Simpler reference implementation provided for dual verification.
 */

/**
 * Counts consecutive occurrences of symbols using an explicit for loop.
 *
 * @param {string} input - Input string to process
 * @returns {Array<{ symbol: string, count: number }>} Array of consecutive symbol occurrences
 */
function countConsecutiveSymbols(input) {
  if (typeof input !== 'string' || input.length === 0) {
    return [];
  }

  const result = [];
  let currentSymbol = input[0];
  let currentCount = 1;

  // Explicit loop through the string
  for (let i = 1; i < input.length; i++) {
    const symbol = input[i];
    if (symbol === currentSymbol) {
      currentCount++;
    } else {
      result.push({ symbol: currentSymbol, count: currentCount });
      currentSymbol = symbol;
      currentCount = 1;
    }
  }

  // Push the final run
  result.push({ symbol: currentSymbol, count: currentCount });

  return result;
}

/**
 * Simpler reference implementation using regular expressions.
 * Used as an independent reference to cross-verify the explicit loop behavior.
 *
 * @param {string} input
 * @returns {Array<{ symbol: string, count: number }>}
 */
function referenceCountConsecutive(input) {
  if (typeof input !== 'string' || input.length === 0) {
    return [];
  }
  // Matches consecutive identical characters
  const matches = input.match(/(.)\1*/g) || [];
  return matches.map((group) => ({
    symbol: group[0],
    count: group.length
  }));
}

/**
 * Independent expected-result table fixture.
 */
const EXPECTED_RESULTS_TABLE = Object.freeze([
  {
    input: 'aaabbc',
    description: 'Contract case: aaabbc',
    expected: [
      { symbol: 'a', count: 3 },
      { symbol: 'b', count: 2 },
      { symbol: 'c', count: 1 }
    ]
  },
  {
    input: '',
    description: 'Contract case: empty string',
    expected: []
  },
  {
    input: 'a',
    description: 'Single character',
    expected: [{ symbol: 'a', count: 1 }]
  },
  {
    input: 'aabbbaac',
    description: 'Non-adjacent repeated symbols',
    expected: [
      { symbol: 'a', count: 2 },
      { symbol: 'b', count: 3 },
      { symbol: 'a', count: 2 },
      { symbol: 'c', count: 1 }
    ]
  },
  {
    input: '112233',
    description: 'Numeric symbols',
    expected: [
      { symbol: '1', count: 2 },
      { symbol: '2', count: 2 },
      { symbol: '3', count: 2 }
    ]
  }
]);

module.exports = {
  countConsecutiveSymbols,
  referenceCountConsecutive,
  EXPECTED_RESULTS_TABLE
};
