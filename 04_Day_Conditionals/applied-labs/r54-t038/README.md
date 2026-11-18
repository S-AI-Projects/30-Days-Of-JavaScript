# Applied Lab (r54-t038): Score Classification — Failure & Recovery

> **Contribution focus**: Demonstrate the stated error or empty state, then a successful recovery on the next valid input without restarting the example.

This applied lab extends **Day 4: Conditionals** with an explicit boundary-tested score classifier and defensive state management that demonstrates immediate error handling and error recovery without restarting the application session.

## Explicit Contract

1. **Classification Boundaries**:
   - Scores below 40 return `'fail'` (e.g. `39` → `'fail'`).
   - Scores between 40 and 74 (inclusive) return `'pass'` (e.g. `40` → `'pass'`, `74` → `'pass'`).
   - Scores between 75 and 100 (inclusive) return `'distinction'` (e.g. `75` → `'distinction'`, `100` → `'distinction'`).
2. **Rejection of Out-of-Range & Invalid Inputs**:
   - Negative scores (`< 0`) or scores exceeding `100` are rejected with a `RangeError`.
   - Non-numeric or nullish inputs are rejected with a `TypeError`.
3. **Failure and Recovery**:
   - An invalid input sets the session into an error state with `lastError` populated and `lastResult = null`.
   - Feeding a subsequent valid input immediately recovers the session to a clean state with `lastError = null` and `lastResult` correctly populated, without needing to restart the session or process.

## Pipeline Flow

```text
Input 1: 39  --> classifyScore(39)  --> Result: 'fail' (ok: true)
Input 2: 40  --> classifyScore(40)  --> Result: 'pass' (ok: true)
Input 3: -5  --> RangeError         --> State: Error (lastError set, lastResult null)
Input 4: 85  --> classifyScore(85)  --> State: Recovered! Result: 'distinction' (lastError cleared)
```

## Running the Example

```bash
node 04_Day_Conditionals/applied-labs/r54-t038/example.js
```

## Running the Automated Checks

```bash
node --test 04_Day_Conditionals/applied-labs/r54-t038/example.test.mjs
```
