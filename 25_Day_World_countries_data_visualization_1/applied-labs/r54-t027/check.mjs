import assert from "node:assert/strict";
import { createLabServer } from "./server.mjs";
import { chromium } from "playwright";

const server = createLabServer();
const browserErrors = [];
let browser;

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});

const address = server.address();

try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto(`http://127.0.0.1:${address.port}`);

  const searchInput = page.locator("#country-search");
  const countryRows = page.locator("#country-list li");
  const matchCount = page.locator("#match-count");
  const emptyState = page.locator("#empty-state");

  assert.deepEqual(await countryRows.allTextContents(), ["India", "Iceland", "Japan"]);
  assert.equal(await matchCount.textContent(), "3 countries found.");

  await searchInput.fill("ia");
  assert.deepEqual(await countryRows.allTextContents(), ["India"]);
  assert.equal(await matchCount.textContent(), "1 country found.");

  await searchInput.fill("IA");
  assert.deepEqual(await countryRows.allTextContents(), ["India"]);

  await searchInput.fill("");
  assert.deepEqual(await countryRows.allTextContents(), ["India", "Iceland", "Japan"]);
  assert.equal(await matchCount.textContent(), "3 countries found.");

  await searchInput.fill("Atlantis");
  assert.equal(await countryRows.count(), 0);
  assert.equal(await matchCount.textContent(), "0 countries found.");
  assert.equal(await emptyState.isVisible(), true);
  assert.equal(await emptyState.textContent(), 'No countries match "Atlantis".');

  await searchInput.fill("ia");
  assert.deepEqual(await countryRows.allTextContents(), ["India"]);
  assert.equal(await matchCount.textContent(), "1 country found.");
  assert.equal(await emptyState.isVisible(), false);

  assert.deepEqual(browserErrors, [], "The page should not report console or runtime errors");
  console.log("PASS: local filtering, counts, empty query, empty state, recovery, and browser errors");
} finally {
  if (browser) {
    await browser.close();
  }
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}