# R54-T045 check evidence

- Inputs: `fail`, then `promises` without reloading.
- Expected: first request reaches `error`; the next valid input reaches `ready` with data in the same browser session.
- Check command: `node 18_Day_Promises/applied-labs/r54-t045/check.mjs`.
- Tool versions: Node.js v24.22.3, pnpm v11.25.0, Playwright 1.62.1, Chromium 151.0.7922.34.
- Actual: `node 18_Day_Promises/applied-labs/r54-t045/check.mjs` passed failure then successful next-input recovery without page restart, plus console/page error checks.
