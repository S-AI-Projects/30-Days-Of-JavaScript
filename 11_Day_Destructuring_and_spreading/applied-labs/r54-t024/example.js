/**
 * Contribution focus: State and test the invariant connecting input/state to output across a short sequence of operations.
 *
 * Applied Lab (r54-t024) for Day 11: Destructuring & Spreading (Destructured Configuration & State Invariant)
 * Contract:
 *  - Merge configuration defaults with explicit overrides while preserving false and 0.
 *  - defaults {limit:10,enabled:true}, overrides {limit:0,enabled:false} preserves both overrides.
 *  - State and test the invariant connecting input/state to output across a sequence of operations.
 */

/**
 * Merges a defaults object with an overrides object using destructuring and spreading.
 * Explicitly preserves falsy values such as `false`, `0`, and empty string `""`.
 * Only strictly `undefined` properties in overrides fallback to defaults.
 *
 * @param {object} defaults - Base default configuration
 * @param {object} overrides - Explicit overrides
 * @returns {object} Merged configuration object
 */
function mergeConfig(defaults = {}, overrides = {}) {
  if (typeof defaults !== 'object' || defaults === null) {
    throw new TypeError('Defaults must be a non-null object');
  }
  if (typeof overrides !== 'object' || overrides === null) {
    throw new TypeError('Overrides must be a non-null object');
  }

  // Filter out undefined values from overrides so defaults take precedence only when undefined
  const cleanedOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([, val]) => val !== undefined)
  );

  return {
    ...defaults,
    ...cleanedOverrides
  };
}

/**
 * Configuration State Manager enforcing the state/invariant rule across operations.
 *
 * Invariant Definition:
 * For every key K in state at step t:
 * 1. If K was explicitly passed in overrides with value V (where V !== undefined),
 *    then state[K] === V (even if V is 0, false, or '').
 * 2. If K was not passed in overrides, state[K] retains its prior value.
 * 3. Initial state matches defaults.
 */
class ConfigManager {
  constructor(initialDefaults = { limit: 10, enabled: true }) {
    this.defaults = Object.freeze({ ...initialDefaults });
    this.state = Object.freeze({ ...this.defaults });
    this.history = [this.state];
  }

  /**
   * Applies an override operation and records state transition.
   * @param {object} overrides
   * @returns {object} New state
   */
  update(overrides = {}) {
    const nextState = mergeConfig(this.state, overrides);
    this.state = Object.freeze(nextState);
    this.history.push(this.state);
    return this.state;
  }

  /**
   * Returns a copy of the current state.
   * @returns {object}
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Verifies the state invariant against a sequence of operations.
   * @param {object} priorState
   * @param {object} overrides
   * @param {object} currentState
   * @returns {{ holds: boolean, violations: string[] }}
   */
  static verifyInvariant(priorState, overrides, currentState) {
    const violations = [];

    // Check all keys in overrides
    for (const [key, val] of Object.entries(overrides)) {
      if (val !== undefined && currentState[key] !== val) {
        violations.push(
          `Invariant violation for key "${key}": expected override value ${JSON.stringify(val)}, but got ${JSON.stringify(currentState[key])}`
        );
      }
    }

    // Check untouched keys from prior state
    for (const [key, val] of Object.entries(priorState)) {
      if (!(key in overrides) && currentState[key] !== val) {
        violations.push(
          `Invariant violation for untouched key "${key}": expected preserved value ${JSON.stringify(val)}, but got ${JSON.stringify(currentState[key])}`
        );
      }
    }

    return {
      holds: violations.length === 0,
      violations
    };
  }
}

// CLI demonstration when executed directly via `node example.js`
if (require.main === module) {
  console.log('--- Applied Lab r54-t024: Destructured Configuration & State Invariant ---');
  console.log('Contribution focus: State and test the invariant connecting input/state to output across a short sequence of operations.\n');

  const defaults = { limit: 10, enabled: true };
  const overrides = { limit: 0, enabled: false };
  const merged = mergeConfig(defaults, overrides);

  console.log('Defaults:', defaults);
  console.log('Overrides:', overrides);
  console.log('Merged output:', merged);
  console.log('Preserved limit=0?:', merged.limit === 0);
  console.log('Preserved enabled=false?:', merged.enabled === false);

  console.log('\n--- Sequence of Operations & Invariant Tracking ---');
  const manager = new ConfigManager({ limit: 10, enabled: true, timeout: 5000 });
  console.log('Step 0 (Initial):', manager.getState());

  const op1 = { limit: 0, enabled: false };
  manager.update(op1);
  console.log('Step 1 (update {limit: 0, enabled: false}):', manager.getState());

  const op2 = { timeout: 0 };
  manager.update(op2);
  console.log('Step 2 (update {timeout: 0}):', manager.getState());

  const op3 = { enabled: true };
  manager.update(op3);
  console.log('Step 3 (update {enabled: true}):', manager.getState());
}

module.exports = {
  mergeConfig,
  ConfigManager
};
