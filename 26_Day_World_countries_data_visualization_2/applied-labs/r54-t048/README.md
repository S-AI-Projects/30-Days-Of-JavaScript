# Rendered frequency chart

The fixed table is A=3, B=1, C=2. Bar widths are relative to the largest value: 100%, one third, and two thirds. A semantic table provides the same category/count values as a text alternative to the chart image.

The check runs repeated render interactions in bounded batches of 1, 3, and 5. It asserts the chart/table values each time and reports render and row-creation counts; it does not use a timing threshold.

```sh
node 26_Day_World_countries_data_visualization_2/applied-labs/r54-t048/check.mjs
```
