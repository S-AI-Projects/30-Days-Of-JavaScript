# Search and sort composition

Search uses a trimmed, case-insensitive name query. Sorting uses the numeric `score` field, so score `2` precedes `10`. The invariant is that changing sort order never changes the set of records selected by the query; it only permutes those records.

Open `index.html` locally. Run the deterministic browser check with:

```sh
node 29_Day_Mini_project_animating_characters/applied-labs/r54-t043/check.mjs
```
