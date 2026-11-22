# R54-T043 check evidence

- Inputs: search `MIRA`, sort on/off/on, then search `RAV`.
- Expected: `Mira 2` precedes `Mira 10`; sorting preserves selected IDs; changing the query selects `Ravi 11`.
- Check command: `node 29_Day_Mini_project_animating_characters/applied-labs/r54-t043/check.mjs`.
- Tool versions: Node.js v24.22.3, pnpm v11.25.0, Playwright 1.62.1, Chromium 151.0.7922.34.
- Actual: `node 29_Day_Mini_project_animating_characters/applied-labs/r54-t043/check.mjs` passed the invariant, numeric 2-before-10 ordering, repeated sort, query update, and console/page error checks.
