# Worked country-filter example

The example runs in a browser and uses only the local fixture `['India', 'Iceland', 'Japan']`.

For query `ia`:

1. Input is `ia`.
2. Normalize the query to lowercase: `ia`.
3. Check names: `india` includes `ia`; `iceland` and `japan` do not.
4. Output: `India`, with a match count of 1.

For an empty query, the normalized query is `''`; every name includes that empty string, so the output contains all three countries. Run the browser check with:

```sh
node 25_Day_World_countries_data_visualization_1/applied-labs/r54-t047/check.mjs
```
