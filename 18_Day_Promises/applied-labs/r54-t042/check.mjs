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
  page.on('console', (entry) => { if (entry.type() === 'error') errors.push(entry.text()) })
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  const field = page.getByLabel('Lesson name')
  await field.fill('   ')
  await page.getByRole('button', { name: 'Load' }).click()
  await assert.equal(await page.getByRole('alert').textContent(), 'Lesson name cannot be blank.')
  await assert.equal(await page.locator('#state').textContent(), 'idle')

  await field.fill('promises')
  await page.getByRole('button', { name: 'Load' }).click()
  await assert.equal(await page.locator('#state').textContent(), 'pending')
  await page.getByText('promises: loaded from the local fixture').waitFor()
  await assert.equal(await page.locator('#state').textContent(), 'ready')

  await field.fill('retry')
  await page.getByRole('button', { name: 'Load' }).click()
  await page.getByRole('button', { name: 'Retry' }).waitFor()
  await assert.equal(await page.locator('#state').textContent(), 'error')
  await page.getByRole('button', { name: 'Retry' }).click()
  await page.getByText('retry: loaded from the local fixture').waitFor()
  await assert.equal(await page.locator('#state').textContent(), 'ready')

  await field.fill('empty')
  await page.getByRole('button', { name: 'Load' }).click()
  await page.getByText('The lesson has no items.').waitFor()
  await assert.equal(await page.locator('#state').textContent(), 'ready')
  assert.deepEqual(errors, [])
  process.stdout.write('R54-T042: blank boundary, pending/ready/error, empty data and retry passed.\n')
} finally {
  await browser?.close()
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
}
