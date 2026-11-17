# Applied Lab Check Report (R54-T022)

> **Contribution focus**: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.

## Tool Versions
- **Node.js**: v26.13.1
- **OS**: Darwin 25.6.0 (arm64)
- **Execution Timestamp**: 2026-11-17T18:04:12.327Z

## Test Results
| Test ID | Description | Input | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `explicit_en_language` | name=Ada, language=en produces "Hello, Ada!" | `{"name":"Ada","language":"en"}` | Hello, Ada! | Hello, Ada! | PASS |
| `omitted_language_default` | Omitted language parameter defaults to "en" | `{"name":"Ada"}` | Hello, Ada! | Hello, Ada! | PASS |
| `blank_name_empty_string` | Zero-length empty string name is rejected | `{"name":"","language":"en"}` | Error: Name cannot be blank | Error: Name cannot be blank | PASS |
| `blank_name_whitespace` | Whitespace-only string name is rejected after trimming | `{"name":"   ","language":"en"}` | Error: Name cannot be blank | Error: Name cannot be blank | PASS |
| `type_boundary_non_string` | Non-string values (null, undefined) are rejected with TypeError | `name = null, name = undefined` | TypeError: Name must be a string | Both null and undefined throw TypeError as expected | PASS |
| `alternate_supported_language` | Specifying alternate language code ("es") formats greeting appropriately | `{"name":"Ada","language":"es"}` | Hola, Ada! | Hola, Ada! | PASS |
| `unsupported_language_code` | Unsupported language codes throw a descriptive error | `{"name":"Ada","language":"unsupported_code"}` | Error containing "Unsupported language" | Error: Unsupported language 'unsupported_code'. Supported languages: en, es, fr, de | PASS |

**Summary**: 7 / 7 tests passed.