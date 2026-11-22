# Deterministic country filter

This filter uses a fixed local fixture (`India`, `Iceland`, `Japan`) and performs case-insensitive substring matching. Query `ia` returns India with a count of 1; an empty query returns all three. The browser check opens two isolated contexts and confirms they produce the same outputs.

Open `index.html` locally or run:

```sh
node 25_Day_World_countries_data_visualization_1/applied-labs/r54-t044/check.mjs
```
