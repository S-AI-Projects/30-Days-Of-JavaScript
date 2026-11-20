# Applied Lab Check Report (R54-T029)

> **Contribution focus**: Check three bounded input sizes or repeated interaction counts; assert correctness and report operation counts or render/listener counts rather than imposing a speed threshold.

## Tool Versions
- **Node.js**: v26.13.1
- **Playwright**: 1.65.1
- **OS**: Darwin 27.2.0 (arm64)
- **Execution Timestamp**: 2026-11-20T15:02:48.214Z

## Test Results
| Test ID | Description | Input | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `T01-SIDE-EFFECT-FREE-IMPORT` | Module import has zero global pollution or side effects, exporting explicit public API | `require("./example.js")` | All public functions present, 0 global scope leaks | Exports: [formatNumber, formatCurrency, formatBatch, generateTestInputs, runScaleExperiment, startServer, BOUNDED_SIZES, DEFAULT_LOCALE, HTML_CONTENT], leaked globals: 0 | PASS |
| `T02-REPEATABLE-FORMAT-EN-US` | Formatting 1234.5 with en-US is repeatable across multiple invocations | `formatNumber(1234.5, { locale: "en-US" }) [3 calls]` | 1,234.5 | 1,234.5 (run1 === run2 === run3: true) | PASS |
| `T03-REPEATABLE-FORMAT-DE-DE` | Formatting 1234.5 with de-DE is repeatable and uses dot grouping and comma decimal | `formatNumber(1234.5, { locale: "de-DE" })` | 1.234,5 | 1.234,5 | PASS |
| `T04-CURRENCY-FORMAT-USD` | Formatting 1234.5 as currency USD in en-US produces exact expected symbol and 2 decimals | `formatCurrency(1234.5, "USD", "en-US")` | $1,234.50 | $1,234.50 | PASS |
| `T05-BOUNDED-INPUT-SCALES-EXPERIMENT` | Checks 3 bounded input sizes (10, 50, 100); asserts 100% correctness and reports operation counts | `Sizes: [10, 50, 100]` | All 3 sizes executed; operationCount equals input size; all outputs correct | Size 10: ops=10, ok=true; Size 50: ops=50, ok=true; Size 100: ops=100, ok=true | PASS |
| `T06-BROWSER-SINGLE-INTERACTION` | Browser verifies single formatter DOM updates for 1234.5 in en-US and de-DE | `Page load & locale change to de-DE` | Initial: 1,234.5, de-DE: 1.234,5 | Initial: 1,234.5, de-DE: 1.234,5 | PASS |
| `T07-BROWSER-SCALE-EXPERIMENT-METRICS` | Browser UI executes all 3 scales; reports exact operation, listener, and render counts | `Click #btn-scale-all` | 3 rows rendered reporting 10, 50, 100 operations with render/listener counts | 3 rows verified: row10="10 items10 operations44PASS (100% correct)", row50="50 items50 operations55PASS (100% correct)", row100="100 items100 operations66PASS (100% correct)" | PASS |
| `T08-ZERO-CONSOLE-PAGE-ERRORS` | Browser session exhibits zero console errors and zero unhandled page errors | `Console and page error listeners during complete run` | 0 console errors, 0 page errors | Console errors: 0, Page errors: 0 | PASS |

**Summary**: 8 / 8 tests passed.