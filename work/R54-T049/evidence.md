# R54-T049 check evidence

- Inputs: add `Buy milk` and `Read docs`; complete `Buy milk`; reload; filter completed; seed corrupt JSON.
- Expected: only `Buy milk` is visible after reload and filtering; corrupt storage resets safely with an announcement.
- Regression focus: the completed predicate is inverted in a temporary one-line mutant and the focused assertion is verified to reject it.
- Check command: `node 30_Day_Mini_project_final/applied-labs/r54-t049/check.mjs`.
- Tool versions: Node.js v24.22.3. npm and Playwright are not installed; browser assertions could not execute here.
- Actual: source syntax and pure logic can be checked; browser-run result pending a Playwright-enabled environment.
