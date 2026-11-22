# Schema-validated JSON round trip

The first working version was a direct `JSON.stringify` / `JSON.parse` round trip for a record. The refactor extracts `validateRecord` as one named responsibility and calls it before serialization and after parsing, leaving the accepted record unchanged.

The fixture `{ name: 'Ada', visits: 3, subscribed: true, nickname: null }` round-trips with its string, number, Boolean, and null values intact. BigInt is rejected with `BigInt is not supported by JSON serialization.` JSON also omits `undefined`, functions, and symbols in objects, converts non-finite numbers to `null`, serializes dates as strings, and rejects cyclic references.

Run:

```sh
node 16_Day_JSON/applied-labs/r54-t046/example.js
node --test 16_Day_JSON/applied-labs/r54-t046/example.test.mjs
```
