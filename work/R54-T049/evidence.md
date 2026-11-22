# R54-T049 check evidence

- Inputs: add `Buy milk` and `Read docs`; complete `Buy milk`; reload; filter completed; seed corrupt JSON.
- Expected: only `Buy milk` is visible after reload and filtering; corrupt storage resets safely with an announcement.
- Regression focus: the completed predicate is inverted in a temporary one-line mutant and the focused assertion is verified to reject it.
- Check command: `node 30_Day_Mini_project_final/applied-labs/r54-t049/check.mjs`.
- Tool versions: Node.js v24.22.3, pnpm v11.25.0, Playwright 1.62.1, Chromium 151.0.7922.34.
- Actual: `node 30_Day_Mini_project_final/applied-labs/r54-t049/check.mjs` passed add/complete/reload/filter, corrupt-storage recovery, one-line mutation detection, and console/page error checks.
