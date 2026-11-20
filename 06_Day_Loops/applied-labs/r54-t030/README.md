# Applied Lab: Consecutive Symbol Counter & Reference Comparison (R54-T030)

## Overview
- **Student**: ABHINANDAN RATHORE
- **Task ID**: R54-T030 · 10 of 10
- **Topic**: Day 6 — Loops (Iteration Summary & Run-Length Counting)
- **Contribution Focus**: *Provide a small independent expected-result table or simpler reference implementation for the defined behavior; compare against it.*

---

## Contract & Specifications

1. **Explicit Loop Implementation**:
   - `countConsecutiveSymbols(input)` processes a string using an explicit `for` loop.
   - For `"aaabbc"` $\rightarrow$ `[{ symbol: 'a', count: 3 }, { symbol: 'b', count: 2 }, { symbol: 'c', count: 1 }]`.
   - For `""` $\rightarrow$ `[]`.

2. **Reference Comparison & Expected-Result Table**:
   - **Independent Expected-Result Table**: A predefined fixture table (`EXPECTED_RESULTS_TABLE`) listing exact input-output expectations across varied edge cases.
   - **Simpler Reference Implementation**: `referenceCountConsecutive(input)` uses regular expression matching (`/(.)\1*/g`) to independently compute run lengths.
   - The test suite cross-verifies the explicit loop against both the static table and the dynamic reference implementation.

---

## Running the Automated Tests

Execute the automated `node:test` suite:
```bash
node --test 06_Day_Loops/applied-labs/r54-t030/example.test.mjs
```

Results are saved to:
- `work/R54-T030/results.json`
- `work/R54-T030/results.md`
