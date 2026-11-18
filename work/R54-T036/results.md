# Applied Lab Check Report (R54-T036)

> **Contribution focus**: Start from a working version, capture its behavior and extract one clearly named responsibility without changing the contract.

## Tool Versions
- **Node.js**: v26.13.1
- **OS**: Darwin 27.2.0 (arm64)
- **Execution Timestamp**: 2026-11-18T19:13:08.567Z

## Test Results
| Test ID | Description | Input | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `greet_ada_en` | Explicit name and language | `{"name":"Ada","language":"en"}` | `"Hello, Ada!"` | `"Hello, Ada!"` | PASS |
| `greet_ada_default` | Omitted language uses default en | `{"name":"Ada"}` | `"Hello, Ada!"` | `"Hello, Ada!"` | PASS |
| `greet_ada_undefined` | Explicit undefined language uses default en | `{"name":"Ada"}` | `"Hello, Ada!"` | `"Hello, Ada!"` | PASS |
| `reject_empty_string` | Empty string rejected | `{"name":""}` | `"Error: Name cannot be blank"` | `"Error thrown"` | PASS |
| `reject_whitespace` | Whitespace-only name rejected | `{"name":"   "}` | `"Error: Name cannot be blank"` | `"Error thrown"` | PASS |
| `reject_null` | Null name rejected | `{"name":null}` | `"Error: Name cannot be blank"` | `"Error thrown"` | PASS |
| `reject_undefined` | Undefined name rejected | `{}` | `"Error: Name cannot be blank"` | `"Error thrown"` | PASS |
| `parity_Ada` | Parity check for Ada | `{"name":"Ada","language":"en"}` | `"Hello, Ada!"` | `"Hello, Ada!"` | PASS |
| `parity_Grace` | Parity check for Grace | `{"name":"Grace"}` | `"Hello, Grace!"` | `"Hello, Grace!"` | PASS |
| `parity_Alan` | Parity check for Alan | `{"name":"Alan","language":"fr"}` | `"Bonjour, Alan!"` | `"Bonjour, Alan!"` | PASS |
| `parity_Margaret` | Parity check for Margaret | `{"name":"Margaret","language":"de"}` | `"Hallo, Margaret!"` | `"Hallo, Margaret!"` | PASS |
| `helper_resolveSalutation` | Extracted resolveSalutation helper functions correctly | `"es"` | `"¡Hola"` | `"¡Hola"` | PASS |
| `helper_validateName` | Extracted validateName trims string correctly | `"  Ada  "` | `"Ada"` | `"Ada"` | PASS |

**Summary**: 13 / 13 tests passed.
