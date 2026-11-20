# Applied Lab Check Report (R54-T028)

> **Contribution focus**: Create a temporary one-line mutant of the decisive condition; add a focused test that passes on the correct example and fails on that mutant.

## Tool Versions
- **Node.js**: v26.13.1
- **OS**: Darwin 27.2.0 (arm64)
- **Execution Timestamp**: 2026-11-20T14:48:48.098Z

## Test Results
| Test ID | Description | Input | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `T01-INDEPENDENT-INSTANCES-INCREMENT` | Incrementing instance A twice gives 2 while instance B remains 0 | `new Counter() for A and B; a.increment() twice` | a.count === 2 && b.count === 0 | a.count = 2, b.count = 0 | PASS |
| `T02-RESET-COUNTER-A` | Resetting Counter A sets count to 0 while Counter B remains 0 | `a.increment() x2; a.reset()` | a.count === 0 && b.count === 0 | a.count = 0, b.count = 0 | PASS |
| `T03-WORKFLOW-FIXTURE` | Workflow fixture asserts A=2, B=0 after increments, and A=0, B=0 after reset | `runCounterWorkflow(Counter)` | aInc=2, bInc=0, aReset=0, bReset=0 | aInc=2, bInc=0, aReset=0, bReset=0 | PASS |
| `T04-DECISIVE-CONDITION-MUTANT` | Focused test passes on correct Counter (aReset=0) and fails on MutantCounter (aReset=2) | `runCounterWorkflow(Counter) vs runCounterWorkflow(MutantCounter)` | Counter passes (aReset=0); MutantCounter fails assertion (aReset=2) | Counter: aReset=0 (PASS); Mutant: aReset=2 (FAILS condition as expected) | PASS |
| `T05-CUSTOM-INITIAL-VALUE-AND-STEP` | Counter supports custom initial value and step, resetting back to custom initial value | `new Counter(10); c.increment(5); c.reset()` | Initial 10 -> increment(5) gives 15 -> reset() gives 10 | count after reset = 10 | PASS |

**Summary**: 5 / 5 tests passed.