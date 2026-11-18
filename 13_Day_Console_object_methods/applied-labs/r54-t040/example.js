/**
 * Contribution focus: Create a temporary one-line mutant of the decisive condition; add a focused test that passes on the correct example and fails on that mutant.
 *
 * Task: R54-T040 (Day 13: Diagnostic Separation & Logger Injection)
 * Contract:
 *  - Route debug output through an injected logger while keeping public result unchanged.
 *  - A logger spy receives structured event; disabling it still returns the same computation result.
 */

// Decisive threshold constant
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.10; // 10%

/**
 * Standard diagnostic logger spy interface
 */
class LoggerSpy {
  constructor() {
    this.events = [];
    this.enabled = true;
  }

  log(event) {
    if (this.enabled) {
      this.events.push({
        ...event,
        timestamp: new Date().toISOString()
      });
    }
  }

  clear() {
    this.events = [];
  }
}

/**
 * Correct implementation:
 * Decisive condition: subtotal >= DISCOUNT_THRESHOLD
 */
function calculateOrderTotal(subtotal, logger = null) {
  if (typeof subtotal !== 'number' || Number.isNaN(subtotal) || subtotal < 0) {
    throw new TypeError('Subtotal must be a non-negative number');
  }

  // --- Decisive Condition ---
  const qualifies = subtotal >= DISCOUNT_THRESHOLD;
  const discount = qualifies ? Number((subtotal * DISCOUNT_RATE).toFixed(2)) : 0;
  const total = Number((subtotal - discount).toFixed(2));

  if (logger && typeof logger.log === 'function') {
    logger.log({
      type: 'DISCOUNT_EVALUATION',
      subtotal,
      qualifies,
      discount,
      total
    });
  }

  return { subtotal, discount, total, qualifies };
}

/**
 * Mutant implementation representing a faulty decisive condition boundary:
 * Mutant condition: subtotal > DISCOUNT_THRESHOLD (fails at exact boundary 100)
 */
function calculateOrderTotalMutant(subtotal, logger = null) {
  if (typeof subtotal !== 'number' || Number.isNaN(subtotal) || subtotal < 0) {
    throw new TypeError('Subtotal must be a non-negative number');
  }

  // --- Mutant Decisive Condition (one-line mutant: > instead of >=) ---
  const qualifies = subtotal > DISCOUNT_THRESHOLD;
  const discount = qualifies ? Number((subtotal * DISCOUNT_RATE).toFixed(2)) : 0;
  const total = Number((subtotal - discount).toFixed(2));

  if (logger && typeof logger.log === 'function') {
    logger.log({
      type: 'DISCOUNT_EVALUATION',
      subtotal,
      qualifies,
      discount,
      total
    });
  }

  return { subtotal, discount, total, qualifies };
}

if (process.argv[1] && process.argv[1].endsWith('example.js')) {
  console.log('=== Day 13: Diagnostic Separation & Logger Injection Demonstration ===');
  const spy = new LoggerSpy();

  console.log('1. Computation with injected logger spy:');
  const resWithLogger = calculateOrderTotal(120, spy);
  console.log('   Result:', resWithLogger);
  console.log('   Spy events captured:', spy.events);

  console.log('\n2. Computation without logger (null):');
  const resWithoutLogger = calculateOrderTotal(120, null);
  console.log('   Result:', resWithoutLogger);
  console.log('   Public results identical:', JSON.stringify(resWithLogger) === JSON.stringify(resWithoutLogger));

  console.log('\n3. Boundary test (100) on original vs mutant:');
  console.log('   Original at boundary (100):', calculateOrderTotal(100));
  console.log('   Mutant at boundary (100):', calculateOrderTotalMutant(100));
}

export {
  DISCOUNT_THRESHOLD,
  DISCOUNT_RATE,
  LoggerSpy,
  calculateOrderTotal,
  calculateOrderTotalMutant
};
