/**
 * Contribution focus: Add a worked explanation from input through intermediate state to output, and make the published example executable by the test.
 *
 * Task: R54-T037 (Day 6: Consecutive Symbol Counting via Explicit Loops)
 * Contract:
 *  - "aaabbc" -> [{ symbol: 'a', count: 3 }, { symbol: 'b', count: 2 }, { symbol: 'c', count: 1 }]
 *  - "" (empty string) -> []
 */

function countConsecutiveSymbols(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }
  if (input.length === 0) {
    return [];
  }

  const result = [];
  let currentSymbol = input[0];
  let currentCount = 1;

  for (let i = 1; i < input.length; i++) {
    const char = input[i];
    if (char === currentSymbol) {
      currentCount++;
    } else {
      result.push({ symbol: currentSymbol, count: currentCount });
      currentSymbol = char;
      currentCount = 1;
    }
  }

  // Push the final tracked group
  result.push({ symbol: currentSymbol, count: currentCount });
  return result;
}

function traceConsecutiveSymbols(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const intermediateStates = [];
  if (input.length === 0) {
    return {
      input,
      intermediateStates: [{ step: 0, char: null, currentSymbol: null, currentCount: 0, snapshot: [] }],
      output: []
    };
  }

  const result = [];
  let currentSymbol = input[0];
  let currentCount = 1;

  intermediateStates.push({
    step: 0,
    index: 0,
    char: input[0],
    currentSymbol,
    currentCount,
    action: 'initialize',
    emitted: []
  });

  for (let i = 1; i < input.length; i++) {
    const char = input[i];
    if (char === currentSymbol) {
      currentCount++;
      intermediateStates.push({
        step: i,
        index: i,
        char,
        currentSymbol,
        currentCount,
        action: 'increment',
        emitted: [...result]
      });
    } else {
      result.push({ symbol: currentSymbol, count: currentCount });
      intermediateStates.push({
        step: i,
        index: i,
        char,
        previousSymbol: currentSymbol,
        previousCount: currentCount,
        currentSymbol: char,
        currentCount: 1,
        action: 'flush_and_reset',
        emitted: [...result]
      });
      currentSymbol = char;
      currentCount = 1;
    }
  }

  result.push({ symbol: currentSymbol, count: currentCount });
  intermediateStates.push({
    step: input.length,
    index: input.length - 1,
    char: null,
    currentSymbol,
    currentCount,
    action: 'flush_final',
    emitted: [...result]
  });

  return {
    input,
    intermediateStates,
    output: result
  };
}

if (process.argv[1] && process.argv[1].endsWith('example.js')) {
  console.log('=== Day 6: Consecutive Symbol Counter Demonstration ===');
  const sample = 'aaabbc';
  console.log(`Input: "${sample}"`);
  const trace = traceConsecutiveSymbols(sample);
  console.log('\n--- Worked Explanation: Intermediate States ---');
  trace.intermediateStates.forEach(s => {
    console.log(`Step ${s.step}: char='${s.char}' action=${s.action} currentGroup={symbol:'${s.currentSymbol}', count:${s.currentCount}} emittedLength=${s.emitted.length}`);
  });
  console.log('\n--- Final Output ---');
  console.log(JSON.stringify(trace.output, null, 2));

  console.log('\nEmpty string check:', countConsecutiveSymbols(''));
}

export { countConsecutiveSymbols, traceConsecutiveSymbols };
