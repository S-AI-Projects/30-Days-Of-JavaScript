# Applied Lab Check Report (R54-T034)

> **Contribution focus**: State and test the invariant connecting input/state to output across a short sequence of operations.

## Tool Versions
- **Node.js**: v26.13.1
- **OS**: Darwin 27.2.0 (arm64)
- **Execution Timestamp**: 2026-11-18T19:20:43.355Z

## Test Results
| Test ID | Description | Input | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `valid_json` | Valid count payload succeeds | `"{\"count\":2}"` | `2` | `2` | PASS |
| `malformed_json` | Malformed JSON returns parse error | `"{malformed json string"` | `"JSON parse error"` | `"JSON parse error"` | PASS |
| `programmer_error_surfaces` | Programmer TypeError surfaces uncaught by catch block | `"null.deref"` | `"TypeError"` | `"TypeError surfaced"` | PASS |
| `type_error_on_invalid_count` | Non-numeric count throws TypeError | `"{\"count\":\"not-a-number\"}"` | `"TypeError"` | `"TypeError thrown"` | PASS |
| `seq_op1_valid` | State invariant: 0 + 2 = 2 | `"{\"count\":2}"` | `2` | `2` | PASS |
| `seq_op2_error_preserves_state` | State invariant preserved during parse error: totalCount remains 2 | `"broken JSON"` | `2` | `2` | PASS |
| `seq_op3_valid` | State invariant: 2 + 5 = 7 | `"{\"count\":5}"` | `7` | `7` | PASS |
| `seq_op4_aborted_preserves_state` | State invariant preserved during unhandled error: totalCount remains 7 | `"RangeError"` | `7` | `7` | PASS |

**Summary**: 8 / 8 tests passed.
