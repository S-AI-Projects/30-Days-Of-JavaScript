import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

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
  const outputs = []
  for (let run = 0; run < 2; run += 1) {
    const context = await browser.newContext()
    const page = await context.newPage()
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (entry) => { if (entry.type() === 'error') errors.push(entry.text()) })
    await page.goto(`http://127.0.0.1:${server.address().port}`)
    const field = page.getByLabel('Country name contains')
    await field.fill('IA')
    const queryOutput = { count: await page.locator('#count').textContent(), names: await page.locator('#countries li').allTextContents() }
    await assert.deepEqual(queryOutput, { count: '1 country found', names: ['India'] })
    await field.fill('')
    const emptyOutput = { count: await page.locator('#count').textContent(), names: await page.locator('#countries li').allTextContents() }
    await assert.deepEqual(emptyOutput, { count: '3 countries found', names: ['India', 'Iceland', 'Japan'] })
    outputs.push([queryOutput, emptyOutput])
    await context.close()
  }
  assert.deepEqual(outputs[0], outputs[1], 'isolated runs must agree')
  assert.deepEqual(errors, [])
  process.stdout.write('R54-T044: fixture filters and two isolated runs agree.\n')
} finally {
  await browser?.close()
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
}
