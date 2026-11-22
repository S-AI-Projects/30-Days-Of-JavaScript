# R54-T014: number formatter module

The module exports one function, createFormatter(locale). It returns an object with format(value) and setLocale(locale). Importing the module does not touch the DOM or the network.

Invariant: the output of format(value) depends only on the value and the current locale, never on earlier calls. Formatting 1234.5 gives 1,234.5 for en-US and 1.234,5 for de-DE, and switching back to en-US gives 1,234.5 again.

Setup, inside this folder:

    npm install
    npx playwright install chromium

Check, from the repository root:

    node 20_Day_Writing_clean_codes/applied-labs/r54-t014/check.mjs
