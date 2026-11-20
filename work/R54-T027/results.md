# R54-T027 Test Evidence

Run date: 2026-11-20

## Check

Command run from the repository root:

```sh
node 25_Day_World_countries_data_visualization_1/applied-labs/r54-t027/check.mjs
```

Result: exit code `0`.

```text
PASS: local filtering, counts, empty query, empty state, recovery, and browser errors
```

## Inputs and Results

| Input | Expected result | Actual result |
| --- | --- | --- |
| Empty query | India, Iceland, Japan; `3 countries found.` | All three listed; count was `3 countries found.` |
| `ia` | India only; `1 country found.` | India listed; count was `1 country found.` |
| `IA` | India only, confirming case-insensitive matching | India listed; count was `1 country found.` |
| Empty query after filtering | All three countries return | All three listed; count was `3 countries found.` |
| `Atlantis` | No country rows, zero count, and visible no-results message | Zero rows; `0 countries found.`; `No countries match "Atlantis".` visible |
| `ia` immediately after `Atlantis` | India returns without restarting; no-results message clears | India listed; count was `1 country found.`; no-results message hidden |
| Browser console and page errors | None | None captured |

## Tool Versions

- Node.js: `v26.13.1`
- npm: `11.20.0`
- Playwright: `1.65.1`
- Chromium: `159.0.8154.6`