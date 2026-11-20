# Country Name Filter

This added Day 25 activity filters a local list of India, Iceland, and Japan as you type. Matching ignores letter case, and the page shows how many countries match.

## Run the example

From this folder, install the pinned dependency and start the local page:

```sh
npm ci
npm start
```

Open `http://127.0.0.1:4173`. An empty search shows all three countries. Searching for `ia` shows India. Searching for `Atlantis` shows a no-results message; replace it with `ia` to recover without reloading the page.

## Run the check

Install Chromium once if it is not already available:

```sh
npx playwright install chromium
```

Then run the browser check from this folder:

```sh
npm test
```

Or run it from the repository root:

```sh
node 25_Day_World_countries_data_visualization_1/applied-labs/r54-t027/check.mjs
```