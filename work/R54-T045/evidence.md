# R54-T045 check evidence

- Inputs: `fail`, then `promises` without reloading.
- Expected: first request reaches `error`; the next valid input reaches `ready` with data in the same browser session.
- Check command: `node 18_Day_Promises/applied-labs/r54-t045/check.mjs`.
- Tool versions: Node.js v24.22.3. npm and Playwright are not installed; browser assertions could not execute here.
- Actual: implementation and browser check added; runtime results pending a Playwright-enabled environment.
