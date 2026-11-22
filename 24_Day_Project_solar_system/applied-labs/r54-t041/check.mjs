import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const folder = fileURLToPath(new URL('.', import.meta.url))
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' }
const errors = []
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

let browser
try {
  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const input = page.getByLabel('Temperature in Celsius')
  for (const [value, expected] of [['0', '0°C = 32°F'], ['100', '100°C = 212°F'], ['-40', '-40°C = -40°F']]) {
    await input.fill(value)
    await page.getByRole('button', { name: 'Convert' }).click()
    await assert.equal(await page.getByLabel('Fahrenheit result').textContent(), expected)
  }
  await input.fill('')
  await page.getByRole('button', { name: 'Convert' }).click()
  await assert.equal(await page.getByRole('alert').textContent(), 'Enter a temperature in Celsius.')
  await assert.equal(await page.getByLabel('Fahrenheit result').textContent(), '')
  await assert.equal(await input.getAttribute('aria-invalid'), 'true')
  assert.deepEqual(errors, [])
  process.stdout.write('R54-T041: conversions and blank-input accessibility passed.\n')
} finally {
  await browser?.close()
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
}
