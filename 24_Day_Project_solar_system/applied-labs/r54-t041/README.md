# Celsius to Fahrenheit

A small local browser example for converting Celsius to Fahrenheit. The labeled numeric field accepts decimal values, the conversion is `C × 9 / 5 + 32`, and a blank or invalid value produces an announced error.

Open `index.html` in a browser. To run the browser check, install the repository's Playwright prerequisite and run:

```sh
node 24_Day_Project_solar_system/applied-labs/r54-t041/check.mjs
```

Expected conversions: `0 → 32`, `100 → 212`, and `-40 → -40`. Submitting an empty field announces an error and does not show a stale result.
