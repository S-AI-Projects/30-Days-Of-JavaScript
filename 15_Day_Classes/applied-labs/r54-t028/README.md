# Applied Lab: Class State & Regression Testing (R54-T028)

## Overview
- **Student**: ABHINANDAN RATHORE
- **Task ID**: R54-T028 · 8 of 10
- **Topic**: Day 15 — Classes (Class State & Instance Independence)
- **Contribution Focus**: *Create a temporary one-line mutant of the decisive condition; add a focused test that passes on the correct example and fails on that mutant.*

---

## Contract & Specifications

1. **Class-based Counter**:
   - `Counter` class encapsulates internal state (`#count`, `#initialValue`).
   - `increment(step)` advances the instance count by step (default 1).
   - `reset()` restores the instance count back to initial value (default 0).
   - `count` getter returns current count.

2. **Instance Independence**:
   - Distinct instances `a` and `b` maintain isolated, independent state.
   - Incrementing `a` twice yields `a.count === 2`, while `b.count` remains `0`.
   - Calling `a.reset()` sets `a.count === 0`, while `b.count` remains `0`.

3. **Decisive Condition & Mutant**:
   - **Correct Condition** in `reset()`:
     ```js
     if (this.#count !== this.#initialValue) {
       this.#count = this.#initialValue;
     }
     ```
   - **Temporary One-Line Mutant**:
     ```js
     if (this.#count === this.#initialValue) { // MUTANT: inverted decisive check
       this.#count = this.#initialValue;
     }
     ```
   - **Regression Verification**:
     The test suite asserts that the workflow passes cleanly on `Counter` (`aCountAfterReset === 0`), and explicitly asserts that `MutantCounter` fails the condition (`aCountAfterReset === 2`).

---

## Running the Automated Tests

Execute the automated `node:test` suite:
```bash
node --test 15_Day_Classes/applied-labs/r54-t028/example.test.mjs
```

Results are recorded in:
- `work/R54-T028/results.json`
- `work/R54-T028/results.md`
