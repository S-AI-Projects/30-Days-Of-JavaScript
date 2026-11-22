# R54-T011: independent counters

createCounter() returns an object with increment() and read(). The count lives inside the closure, so each counter keeps its own value and nothing is stored in a global variable.

Setup, inside this folder:

    npm install
    npx playwright install chromium

Check, from the repository root:

    node 19_Day_Closures/applied-labs/r54-t011/check.mjs
