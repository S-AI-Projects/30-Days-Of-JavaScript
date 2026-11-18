# Applied Lab Check Report (R54-T040)

> **Contribution focus**: Create a temporary one-line mutant of the decisive condition; add a focused test that passes on the correct example and fails on that mutant.

## Tool Versions
- **Node.js**: v26.13.1
- **OS**: Darwin 27.2.0 (arm64)
- **Execution Timestamp**: 2026-11-18T19:49:26.157Z

## Test Results
| Test ID | Description | Input | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `logger_receives_event` | Logger spy receives structured event | `150` | `135` | `135` | PASS |
| `parity_no_logger` | Omitting logger preserves identical result | `120` | `{"subtotal":120,"discount":12,"total":108,"qualifies":true}` | `{"subtotal":120,"discount":12,"total":108,"qualifies":true}` | PASS |
| `parity_disabled_logger` | Disabling logger preserves identical result and emits 0 events | `120` | `{"subtotal":120,"discount":12,"total":108,"qualifies":true}` | `{"subtotal":120,"discount":12,"total":108,"qualifies":true}` | PASS |
| `correct_boundary_test` | Correct example qualifies at boundary 100 (subtotal >= 100) | `100` | `90` | `90` | PASS |
| `mutant_detected` | Decisive mutant (subtotal > 100) correctly fails boundary test | `100` | `"AssertionError on mutant"` | `"Mutant failed assertion as expected"` | PASS |

**Summary**: 5 / 5 tests passed.
