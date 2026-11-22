import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript' };

const server = http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  try {
    const body = await readFile(join(root, path === '/' ? 'index.html' : path));
    res.writeHead(200, { 'content-type': types[extname(path)] || 'text/html' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});

await new Promise(resolve => server.listen(0, resolve));
const url = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const errors = [];

try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(url);
  const texts = () => page.locator('#results li').allTextContents();
  const message = () => page.locator('#message').textContent();

  await page.fill('#query', 'AN');
  assert.deepEqual(await texts(), ['Anaconda 2', 'Ant 10', 'Panther 30']);
  assert.equal(await message(), '');

  await page.fill('#query', 'zzz');
  assert.deepEqual(await texts(), []);
  assert.equal(await message(), 'No characters found');

  await page.fill('#query', 'bee');
  assert.deepEqual(await texts(), ['Bee 5']);
  assert.equal(await message(), '');

  assert.deepEqual(errors, []);
  console.log('search and sort check passed');
} finally {
  await browser.close();
  server.close();
}
