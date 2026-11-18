# Applied Lab (r54-t034): Exception Boundary & State Invariant

> **Contribution focus**: State and test the invariant connecting input/state to output across a short sequence of operations.

This applied lab extends **Day 14: Error Handling** by establishing precise exception boundaries when processing JSON payloads. It demonstrates selective error handling (handling only expected `SyntaxError` failures from untrusted input) while ensuring unrelated programmer errors (`TypeError`, `ReferenceError`) are never masked or suppressed.

## Explicit Contract

1. **Selective Catch Boundary**:
   - Valid JSON `{"count":2}` succeeds with `{ ok: true, data: { count: 2 }, countAdded: 2, totalCount: 2 }`.
   - Malformed JSON (e.g. `'{bad_json'`) produces a structured parse error response (`{ ok: false, error: 'JSON parse error' }`).
   - Unrelated programmer errors (e.g., calling undefined methods or type violations) surface and re-throw rather than being suppressed.
2. **State Invariant Over Sequence of Operations**:
   - Invariant: `totalCount(t) = totalCount(t-1) + (isValid(t) ? inputCount(t) : 0)`
   - Malformed JSON inputs and rejected operations preserve the existing state intact without side-effects or partial state corruption.

## State Invariant Sequence

| Operation | Input String | Invariant Check | Result Status | `totalCount` | `parseErrors` |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **Op 1** | `'{"count":2}'` | Initial state `0 + 2 = 2` | `ok: true` | `2` | `0` |
| **Op 2** | `'{invalid-json'` | Parse error: state unchanged (`2 == 2`) | `ok: false` | `2` | `1` |
| **Op 3** | `'{"count":5}'` | Valid input: state updated (`2 + 5 = 7`) | `ok: true` | `7` | `1` |
| **Op 4** | `'{"count":3}'` + Error | Programmer error surfaces: state unchanged (`7 == 7`) | Throws `TypeError` | `7` | `1` |

## Running the Example

```bash
node 14_Day_Error_handling/applied-labs/r54-t034/example.js
```

## Running the Automated Checks

```bash
node --test 14_Day_Error_handling/applied-labs/r54-t034/example.test.mjs
```
