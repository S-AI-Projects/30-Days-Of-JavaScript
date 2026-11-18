# Applied Lab Check Report (R54-T038)

> **Contribution focus**: Demonstrate the stated error or empty state, then a successful recovery on the next valid input without restarting the example.

## Tool Versions
- **Node.js**: v26.13.1
- **OS**: Darwin 27.2.0 (arm64)
- **Execution Timestamp**: 2026-11-18T18:18:11.703Z

## Test Results
| Test ID | Description | Input | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `boundary_39` | Score 39 yields fail | `39` | `"fail"` | `"fail"` | PASS |
| `boundary_40` | Score 40 yields pass | `40` | `"pass"` | `"pass"` | PASS |
| `boundary_74` | Score 74 yields pass | `74` | `"pass"` | `"pass"` | PASS |
| `boundary_75` | Score 75 yields distinction | `75` | `"distinction"` | `"distinction"` | PASS |
| `boundary_0` | Lower bound 0 yields fail | `0` | `"fail"` | `"fail"` | PASS |
| `boundary_100` | Upper bound 100 yields distinction | `100` | `"distinction"` | `"distinction"` | PASS |
| `reject_negative` | Score -1 throws RangeError | `-1` | `"RangeError"` | `"RangeError thrown"` | PASS |
| `reject_over_100` | Score 101 throws RangeError | `101` | `"RangeError"` | `"RangeError thrown"` | PASS |
| `reject_non_number` | String score throws TypeError | `"invalid"` | `"TypeError"` | `"TypeError thrown"` | PASS |
| `reject_null` | Null score throws TypeError | `null` | `"TypeError"` | `"TypeError thrown"` | PASS |
| `session_initial_valid` | Session starts in valid state | `50` | `"pass"` | `"pass"` | PASS |
| `session_error_state` | Invalid input produces error state without session crash | `-10` | `"error state"` | `"error state recorded"` | PASS |
| `session_second_error` | Out of range input maintains error state | `150` | `"error state"` | `"error state recorded"` | PASS |
| `session_recovery` | Subsequent valid input immediately recovers session state | `85` | `"distinction"` | `"distinction"` | PASS |
| `session_recovery_boundary` | Subsequent boundary input correctly processed | `39` | `"fail"` | `"fail"` | PASS |

**Summary**: 15 / 15 tests passed.
