# Applied Lab Check Report (R54-T024)

> **Contribution focus**: State and test the invariant connecting input/state to output across a short sequence of operations.

## Tool Versions
- **Node.js**: v26.13.1
- **OS**: Darwin 25.6.0 (arm64)
- **Execution Timestamp**: 2026-11-17T19:01:48.415Z

## Test Results
| Test ID | Description | Input | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `falsy_overrides_preservation` | defaults {limit:10,enabled:true}, overrides {limit:0,enabled:false} preserves both overrides | `defaults={"limit":10,"enabled":true}, overrides={"limit":0,"enabled":false}` | {"limit":0,"enabled":false} | {"limit":0,"enabled":false} | PASS |
| `empty_string_and_null_preservation` | Preserves empty string and null overrides without defaulting | `defaults={"prefix":"default_","handler":"defaultHandler"}, overrides={"prefix":"","handler":null}` | {"prefix":"","handler":null} | {"prefix":"","handler":null} | PASS |
| `unspecified_keys_retain_defaults` | Omitted keys in overrides retain their initial default values | `defaults={limit:10,enabled:true,timeout:5000}, overrides={limit:50}` | {"limit":50,"enabled":true,"timeout":5000} | {"limit":50,"enabled":true,"timeout":5000} | PASS |
| `state_invariant_sequence_step_1` | State invariant holds for operation 1: update {limit: 0, enabled: false} | `prior={"limit":10,"enabled":true,"timeout":5000}, op={"limit":0,"enabled":false}` | Invariant holds: limit=0, enabled=false, timeout=5000 | Invariant holds: limit=0, enabled=false, timeout=5000 | PASS |
| `state_invariant_sequence_step_2` | State invariant holds for operation 2: update {timeout: 0} while preserving prior state | `prior={"limit":0,"enabled":false,"timeout":5000}, op={"timeout":0}` | Invariant holds: limit=0, enabled=false, timeout=0 | Invariant holds: limit=0, enabled=false, timeout=0 | PASS |
| `state_invariant_sequence_step_3` | State invariant holds for operation 3: update {enabled: true} while retaining numeric zeros | `prior={"limit":0,"enabled":false,"timeout":0}, op={"enabled":true}` | Invariant holds: limit=0, enabled=true, timeout=0 | Invariant holds: limit=0, enabled=true, timeout=0 | PASS |
| `input_validation_type_error` | Rejects non-object defaults or overrides with TypeError | `mergeConfig(null, {}), mergeConfig({}, null)` | TypeError thrown for both invalid arguments | Both throw TypeError as expected | PASS |

**Summary**: 7 / 7 tests passed.