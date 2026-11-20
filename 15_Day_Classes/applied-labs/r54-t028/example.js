/**
 * Day 15: Classes — Class State & Regression-Focused Lab
 *
 * Task: R54-T028 · 8 of 10
 * Contribution focus: Create a temporary one-line mutant of the decisive condition;
 * add a focused test that passes on the correct example and fails on that mutant.
 *
 * Contract:
 *  - Counter class with increment, reset, and count getter.
 *  - Independent instances: incrementing A does not affect B.
 *  - Increment A twice gives 2; B remains 0; reset A gives 0.
 *  - Decisive condition: reset condition ensuring state is restored to initialValue.
 *  - Export Counter, MutantCounter (mutant of decisive condition), and runCounterWorkflow.
 */

class Counter {
  #initialValue;
  #count;

  /**
   * Initializes a new independent Counter instance.
   * @param {number} [initialValue=0] - Initial starting count
   */
  constructor(initialValue = 0) {
    this.#initialValue = Number.isFinite(initialValue) ? Math.floor(initialValue) : 0;
    this.#count = this.#initialValue;
  }

  /**
   * Current counter value.
   * @returns {number}
   */
  get count() {
    return this.#count;
  }

  /**
   * Initial counter value configured at construction.
   * @returns {number}
   */
  get initialValue() {
    return this.#initialValue;
  }

  /**
   * Increments instance count by step.
   * Decisive condition: verifies step is a finite positive number.
   * @param {number} [step=1]
   * @returns {number} Updated count
   */
  increment(step = 1) {
    const validStep = (typeof step === 'number' && Number.isFinite(step) && step > 0) ? step : 1;
    this.#count += validStep;
    return this.#count;
  }

  /**
   * Resets counter to its initial value.
   * Decisive condition: verifies current count differs from initialValue before resetting.
   * @returns {number} Reset count (initialValue)
   */
  reset() {
    // Decisive condition: restores count to initialValue
    if (this.#count !== this.#initialValue) {
      this.#count = this.#initialValue;
    }
    return this.#count;
  }
}

/**
 * MutantCounter: Temporary mutant of the decisive condition.
 * Demonstrates a regression bug where the reset decisive condition is inverted/corrupted.
 *
 * Correct condition:  if (this.#count !== this.#initialValue) { this.#count = this.#initialValue; }
 * Mutant condition:   if (this.#count === this.#initialValue) { this.#count = this.#initialValue; }
 *
 * Result: The mutant fails to reset when the count has changed from initialValue!
 */
class MutantCounter {
  #initialValue;
  #count;

  constructor(initialValue = 0) {
    this.#initialValue = Number.isFinite(initialValue) ? Math.floor(initialValue) : 0;
    this.#count = this.#initialValue;
  }

  get count() {
    return this.#count;
  }

  get initialValue() {
    return this.#initialValue;
  }

  increment(step = 1) {
    const validStep = (typeof step === 'number' && Number.isFinite(step) && step > 0) ? step : 1;
    this.#count += validStep;
    return this.#count;
  }

  reset() {
    // ONE-LINE MUTANT of the decisive condition:
    // Inverted check causes reset to be skipped when count !== initialValue!
    if (this.#count === this.#initialValue) {
      this.#count = this.#initialValue;
    }
    return this.#count;
  }
}

/**
 * Executes the counter workflow fixture for given Counter class.
 * Workflow:
 *  1. Instantiates independent counters A and B with initialValue=0.
 *  2. Increments A twice.
 *  3. Captures A and B counts (expected A=2, B=0).
 *  4. Resets A.
 *  5. Captures A and B counts (expected A=0, B=0).
 *
 * @param {typeof Counter|typeof MutantCounter} [CounterClass=Counter]
 * @returns {{ aCountAfterIncrement: number, bCountAfterIncrement: number, aCountAfterReset: number, bCountAfterReset: number }}
 */
function runCounterWorkflow(CounterClass = Counter) {
  const a = new CounterClass(0);
  const b = new CounterClass(0);

  // Increment A twice
  a.increment();
  a.increment();

  const aCountAfterIncrement = a.count;
  const bCountAfterIncrement = b.count;

  // Reset A
  a.reset();

  const aCountAfterReset = a.count;
  const bCountAfterReset = b.count;

  return {
    aCountAfterIncrement,
    bCountAfterIncrement,
    aCountAfterReset,
    bCountAfterReset
  };
}

module.exports = {
  Counter,
  MutantCounter,
  runCounterWorkflow
};
