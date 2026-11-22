import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const folder = fileURLToPath(new URL('.', import.meta.url))
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' }
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
  const input = page.getByLabel('Country name contains')
  await input.fill('ia')
  await assert.equal(await page.locator('#trace').textContent(), 'Input “ia” → normalized query “ia”; checked 3 names.')
  await assert.equal(await page.locator('#count').textContent(), '1 country found')
  await assert.deepEqual(await page.locator('#countries li').allTextContents(), ['India'])
  await input.fill('')
  await assert.equal(await page.locator('#count').textContent(), '3 countries found')
  await assert.deepEqual(await page.locator('#countries li').allTextContents(), ['India', 'Iceland', 'Japan'])
  assert.deepEqual(errors, [])
  process.stdout.write('R54-T047: worked filter trace and executable results passed.\n')
} finally {
  await browser?.close()
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
}
