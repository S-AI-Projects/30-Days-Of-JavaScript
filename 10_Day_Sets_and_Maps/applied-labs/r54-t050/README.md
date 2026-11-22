# Case-insensitive tag summary

`summaryTags` uses a `Map` for case-normalized occurrence counts and a `Set` for distinct tags. It trims surrounding whitespace, lowercases tags, ignores blank tags, and rejects non-string entries.

```sh
node 10_Day_Sets_and_Maps/applied-labs/r54-t050/example.js
node --test 10_Day_Sets_and_Maps/applied-labs/r54-t050/example.test.mjs
```

For `['JS', 'js', 'Python']`, counts are `js: 2`, `python: 1`, and there are two unique tags.
