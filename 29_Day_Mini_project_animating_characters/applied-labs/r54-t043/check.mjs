import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { characters, selectCharacters } from './logic.mjs'

const folder = fileURLToPath(new URL('.', import.meta.url))
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8' }
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const file = resolve(join(folder, pathname === '/' ? 'index.html' : pathname.slice(1)))
    assert.ok(file.startsWith(`${resolve(folder)}${sep}`) || file === resolve(folder, 'index.html'))
    response.writeHead(200, { 'content-type': mimeTypes[extname(file)] ?? 'application/octet-stream' })
    response.end(await readFile(file))
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
})

const errors = []
let browser
try {
  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (entry) => { if (entry.type() === 'error') errors.push(entry.text()) })
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const field = page.getByLabel('Search by name')
  await field.fill('MIRA')
  const selectedBeforeSort = selectCharacters(characters, 'MIRA', false).map((item) => item.id).sort()
  await page.getByRole('button', { name: 'Sort by score' }).click()
  const sortedIds = await page.locator('#results li').evaluateAll((rows) => rows.map((row) => row.dataset.id))
  assert.deepEqual([...sortedIds].sort(), selectedBeforeSort, 'sorting changes order, not query membership')
  assert.deepEqual(sortedIds, ['c2', 'c10'], 'numeric score 2 must precede 10')
  await page.getByRole('button', { name: 'Sort by score' }).click()
  await page.getByRole('button', { name: 'Sort by score' }).click()
  assert.deepEqual(await page.locator('#results li').evaluateAll((rows) => rows.map((row) => row.dataset.id)), ['c2', 'c10'])
  await field.fill('RAV')
  assert.deepEqual(await page.locator('#results li').allTextContents(), ['Ravi 11 — 11'])
  assert.deepEqual(errors, [])
  process.stdout.write('R54-T043: query/sort invariant and numeric order passed.\n')
} finally {
  await browser?.close()
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
}
