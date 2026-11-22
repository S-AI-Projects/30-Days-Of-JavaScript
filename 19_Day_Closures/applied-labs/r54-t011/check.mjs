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
  const result = await page.evaluate(async () => {
    const { createCounter } = await import('/example.js');
    const first = createCounter();
    const second = createCounter();
    first.increment();
    first.increment();
    return {
      first: first.read(),
      second: second.read(),
      leaked: 'count' in window
    };
  });
  assert.equal(result.first, 2);
  assert.equal(result.second, 0);
  assert.equal(result.leaked, false);
  assert.deepEqual(errors, []);
  console.log('counter check passed');
} finally {
  await browser.close();
  server.close();
}
