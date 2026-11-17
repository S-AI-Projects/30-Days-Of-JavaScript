# Applied Lab (r54-t024): Destructured Configuration & State Invariant

> **Contribution focus**: State and test the invariant connecting input/state to output across a short sequence of operations.

This applied lab extends object destructuring and spread syntax from **Day 11: Destructuring and Spreading** by demonstrating safe configuration merging that preserves valid falsy values (`0`, `false`, `""`) without accidental fallback to defaults.

## Explicit Contract

1. **Falsy Overrides Preservation**:
   - `defaults = { limit: 10, enabled: true }`
   - `overrides = { limit: 0, enabled: false }`
   - Merged result strictly yields `{ limit: 0, enabled: false }` (neither `0` nor `false` is overridden by defaults).
2. **State Invariant Across Sequence of Operations**:
   - **Invariant Definition**: Across any transition from $S_{t-1}$ to $S_t$ with overrides $O_t$:
     - For any key $K \in O_t$ where $O_t[K] \neq \text{undefined}$, $S_t[K] === O_t[K]$.
     - For any key $K \notin O_t$, $S_t[K] === S_{t-1}[K]$.
     - Falsy values (`0`, `false`, `""`) are strictly preserved.
3. **Sequence Testing**:
   - Step 1: Initial state `{ limit: 10, enabled: true, timeout: 5000 }`
   - Step 2: Override `{ limit: 0, enabled: false }` → invariant holds: `limit: 0`, `enabled: false`, `timeout: 5000`.
   - Step 3: Override `{ timeout: 0 }` → invariant holds: `limit: 0`, `enabled: false`, `timeout: 0`.
   - Step 4: Override `{ enabled: true }` → invariant holds: `limit: 0`, `enabled: true`, `timeout: 0`.

## Running the Example

Run the local demonstration:

```bash
node 11_Day_Destructuring_and_spreading/applied-labs/r54-t024/example.js
```

## Running the Automated Tests

Run the built-in Node.js test suite:

```bash
node --test 11_Day_Destructuring_and_spreading/applied-labs/r54-t024/example.test.mjs
```

Test results, inputs, expected versus actual outputs, and tool versions are recorded in `work/R54-T024/`.
