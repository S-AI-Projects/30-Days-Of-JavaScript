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
    const { createList } = await import('/example.js');
    const list = createList(document.getElementById('list'));
    const read = () => [...document.querySelectorAll('#list li')].map(li => li.textContent);
    list.add({ id: 'a', text: 'A' });
    list.add({ id: 'b', text: 'B' });
    const afterAdd = read();
    list.add({ id: 'a', text: 'A' });
    const afterRepeat = read();
    list.remove('a');
    const afterRemove = read();
    let threw = false;
    try {
      list.remove('missing');
    } catch {
      threw = true;
    }
    return { afterAdd, afterRepeat, afterRemove, threw, afterMissing: read() };
  });
  assert.deepEqual(result.afterAdd, ['A', 'B']);
  assert.deepEqual(result.afterRepeat, ['A', 'B']);
  assert.deepEqual(result.afterRemove, ['B']);
  assert.equal(result.threw, false);
  assert.deepEqual(result.afterMissing, ['B']);
  assert.deepEqual(errors, []);
  console.log('keyed list check passed');
} finally {
  await browser.close();
  server.close();
}
