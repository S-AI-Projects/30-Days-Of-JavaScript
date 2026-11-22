# R54-T050 check evidence

- Input: `['JS', 'js', 'Python']`.
- Expected: counts `js: 2`, `python: 1`; two unique tags.
- Independent reference table also covers whitespace/case normalization and the empty array.
- Check command: `node --test 10_Day_Sets_and_Maps/applied-labs/r54-t050/example.test.mjs`.
- Tool versions: Node.js v24.22.3.
- Actual output: `Counts: { js: 2, python: 1 }`; `Unique tags: [ 'js', 'python' ]`.
- Test result: 2 tests passed, 0 failed on Node.js v24.22.3.
