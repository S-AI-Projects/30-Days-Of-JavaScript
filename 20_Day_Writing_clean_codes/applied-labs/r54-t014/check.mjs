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
  const before = await page.evaluate(() => document.documentElement.outerHTML);
  const requests = [];
  page.on('request', request => requests.push(new URL(request.url()).pathname));
  const result = await page.evaluate(async () => {
    const mod = await import('/example.js?fresh');
    const formatter = mod.createFormatter('en-US');
    const first = formatter.format(1234.5);
    formatter.setLocale('de-DE');
    const german = formatter.format(1234.5);
    formatter.setLocale('en-US');
    const again = formatter.format(1234.5);
    const freshGerman = mod.createFormatter('de-DE').format(1234.5);
    return { names: Object.keys(mod), first, german, again, freshGerman };
  });
  const after = await page.evaluate(() => document.documentElement.outerHTML);
  assert.equal(after, before);
  assert.deepEqual(requests, ['/example.js']);
  assert.deepEqual(result.names, ['createFormatter']);
  assert.equal(result.first, '1,234.5');
  assert.equal(result.german, '1.234,5');
  assert.equal(result.again, result.first);
  assert.equal(result.german, result.freshGerman);
  assert.deepEqual(errors, []);
  console.log('formatter check passed');
} finally {
  await browser.close();
  server.close();
}
