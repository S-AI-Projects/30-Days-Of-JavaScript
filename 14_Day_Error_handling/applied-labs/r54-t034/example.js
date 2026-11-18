/**
 * Contribution focus: State and test the invariant connecting input/state to output across a short sequence of operations.
 *
 * Task: R54-T034 (Day 14: Exception Boundary & State Invariant Lab)
 * Contract:
 *  - Valid {"count":2} succeeds
 *  - Malformed JSON returns a specific parse error
 *  - No catch block suppresses every error type (non-SyntaxError programmer errors re-throw)
 */

class JsonCounterPipeline {
  constructor() {
    this.totalCount = 0;
    this.parseErrors = 0;
    this.successfulBatches = 0;
  }

  /**
   * Parses JSON containing a count property and updates running total.
   * Catches ONLY SyntaxError to return a structured parse error.
   * Unrelated programmer errors (e.g. TypeError, ReferenceError) surface/re-throw.
   */
  process(jsonString, transformer = null) {
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      if (err instanceof SyntaxError) {
        this.parseErrors++;
        return {
          ok: false,
          error: 'JSON parse error',
          message: err.message,
          totalCount: this.totalCount
        };
      }
      // Re-throw any unrelated non-syntax errors
      throw err;
    }

    // Optional transformer callback to demonstrate programmer error surfacing
    if (transformer) {
      // Programmer error if transformer is not callable or throws
      parsed = transformer(parsed);
    }

    if (parsed === null || typeof parsed !== 'object' || typeof parsed.count !== 'number' || Number.isNaN(parsed.count)) {
      throw new TypeError('Payload must be an object with numeric count property');
    }

    this.totalCount += parsed.count;
    this.successfulBatches++;

    return {
      ok: true,
      data: parsed,
      countAdded: parsed.count,
      totalCount: this.totalCount
    };
  }

  getSnapshot() {
    return {
      totalCount: this.totalCount,
      parseErrors: this.parseErrors,
      successfulBatches: this.successfulBatches
    };
  }
}

function parseCountJson(jsonString) {
  const pipeline = new JsonCounterPipeline();
  return pipeline.process(jsonString);
}

if (process.argv[1] && process.argv[1].endsWith('example.js')) {
  console.log('=== Day 14: Exception Boundary Demonstration ===');
  const pipeline = new JsonCounterPipeline();

  console.log('1. Valid JSON {"count":2}:', pipeline.process('{"count":2}'));
  console.log('2. Malformed JSON (syntax error boundary):', pipeline.process('{bad_json'));
  console.log('3. Valid JSON {"count":5}:', pipeline.process('{"count":5}'));
  console.log('Final pipeline snapshot (Invariant verified):', pipeline.getSnapshot());

  try {
    console.log('4. Programmer error propagation test:');
    pipeline.process('{"count":1}', () => {
      // Intentionally trigger TypeError
      null.nonExistentMethod();
    });
  } catch (err) {
    console.log('   Correctly surfaced programmer error:', err.name, '-', err.message);
  }
}

export { JsonCounterPipeline, parseCountJson };
