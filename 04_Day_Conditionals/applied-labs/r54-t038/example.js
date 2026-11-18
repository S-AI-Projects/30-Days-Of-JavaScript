/**
 * Contribution focus: Demonstrate the stated error or empty state, then a successful recovery on the next valid input without restarting the example.
 *
 * Task: R54-T038 (Day 4: Score Classification & Recovery Lab)
 * Contract:
 *  - Return 'fail' below 40 (e.g., 39 -> 'fail')
 *  - Return 'pass' from 40 to 74 (e.g., 40 -> 'pass', 74 -> 'pass')
 *  - Return 'distinction' from 75 to 100 (e.g., 75 -> 'distinction', 100 -> 'distinction')
 *  - Reject scores outside 0..100
 */

function classifyScore(score) {
  if (score === null || score === undefined || typeof score !== 'number' || Number.isNaN(score)) {
    throw new TypeError('Invalid score: score must be a valid number');
  }
  if (score < 0 || score > 100) {
    throw new RangeError(`Invalid score: ${score} is outside allowable range 0..100`);
  }
  if (score < 40) {
    return 'fail';
  }
  if (score <= 74) {
    return 'pass';
  }
  return 'distinction';
}

class ScoreClassifierSession {
  constructor() {
    this.history = [];
    this.lastError = null;
    this.lastResult = null;
  }

  process(score) {
    try {
      const grade = classifyScore(score);
      this.lastError = null;
      this.lastResult = grade;
      const record = { input: score, status: 'success', grade };
      this.history.push(record);
      return { ok: true, grade, record };
    } catch (err) {
      this.lastError = err.message;
      this.lastResult = null;
      const record = { input: score, status: 'error', error: err.message };
      this.history.push(record);
      return { ok: false, error: err.message, record };
    }
  }

  reset() {
    this.history = [];
    this.lastError = null;
    this.lastResult = null;
  }
}

if (process.argv[1] && process.argv[1].endsWith('example.js')) {
  console.log('=== Score Classification & Recovery Demonstration ===');
  const session = new ScoreClassifierSession();

  console.log('1. Valid boundary 39:', session.process(39));
  console.log('2. Valid boundary 40:', session.process(40));
  console.log('3. Valid boundary 74:', session.process(74));
  console.log('4. Valid boundary 75:', session.process(75));

  console.log('\n--- Demonstrating failure and recovery without session restart ---');
  console.log('5. Invalid score -5 (Error State):', session.process(-5));
  console.log('   Session lastError:', session.lastError);
  console.log('   Session lastResult:', session.lastResult);

  console.log('6. Subsequent valid score 85 (Recovered State):', session.process(85));
  console.log('   Session lastError:', session.lastError);
  console.log('   Session lastResult:', session.lastResult);
}

export { classifyScore, ScoreClassifierSession };
