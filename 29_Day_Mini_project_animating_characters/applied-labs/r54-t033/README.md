# Applied Lab (r54-t033): Search & Numeric Sort Composition

> **Contribution focus**: Provide a small independent expected-result table or simpler reference implementation for the defined behavior; compare against it.

This applied lab extends **Day 29: Mini Project Animating Characters / DOM Projects** by implementing composed search querying and numeric sorting on local datasets, avoiding lexicographical string comparison pitfalls (guaranteeing that numeric `2` properly precedes `10`), with validation against an independent reference oracle.

## Explicit Contract

1. **Case-Insensitive Search Filtering**:
   - Querying `"javascript"` selects records matching `"JavaScript Intro"`, `"JavaScript Basics"`, `"JavaScript Mastery"`, and `"javascript Advanced"`, while excluding non-matching records.
2. **Proper Numeric Sorting**:
   - Scores are sorted numerically using `(a.score - b.score)`.
   - In ascending order, score `2` strictly precedes score `10` (contrasting with standard lexicographical sort where `"10"` precedes `"2"`).
3. **Reference Oracle Parity**:
   - The UI output dynamically matches an independent pure reference implementation (`referenceFilterAndSort`).

## Expected Reference Results Table

| Query | Sort Order | Expected Records in Sequence | Verification |
| :--- | :---: | :--- | :---: |
| `"javascript"` | `asc` | 1. `JavaScript Intro (1)`<br>2. `JavaScript Basics (2)`<br>3. `javascript Advanced (5)`<br>4. `JavaScript Mastery (10)` | Numeric `2` precedes `10` |
| `"java"` | `asc` | 1. `JavaScript Intro (1)`<br>2. `JavaScript Basics (2)`<br>3. `javascript Advanced (5)`<br>4. `JavaScript Mastery (10)`<br>5. `Java Programming (15)` | Matches oracle |
| `""` (all) | `desc` | 1. `Python Guide (20)`<br>2. `Java Programming (15)`<br>3. `JavaScript Mastery (10)`<br>4. `javascript Advanced (5)`<br>5. `JavaScript Basics (2)`<br>6. `JavaScript Intro (1)` | Decreasing numeric order |

## Running the Example

Start the local standalone web server:

```bash
node 29_Day_Mini_project_animating_characters/applied-labs/r54-t033/example.js
```

## Running the Automated Checks

Run the automated Playwright validation suite:

```bash
node 29_Day_Mini_project_animating_characters/applied-labs/r54-t033/check.mjs
```
