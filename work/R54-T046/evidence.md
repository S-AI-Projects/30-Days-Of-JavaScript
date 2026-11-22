# R54-T046 check evidence

- Input: `{ name: 'Ada', visits: 3, subscribed: true, nickname: null }`.
- Expected/actual: round-trip preserves all four values and types; BigInt is rejected with `BigInt is not supported by JSON serialization.`
- Check command: `node --test 16_Day_JSON/applied-labs/r54-t046/example.test.mjs`.
- Tool versions: Node.js v24.22.3.
- Tool versions: Node.js v24.22.3.
- Actual test result: 3 tests passed, 0 failed; example output was `{"name":"Ada","visits":3,"subscribed":true,"nickname":null}`.
