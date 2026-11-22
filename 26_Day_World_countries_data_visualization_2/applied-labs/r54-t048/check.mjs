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

  const assertChart = async () => {
    assert.equal(await page.locator('#chart').getAttribute('aria-label'), 'Frequency chart: A 3, B 1, C 2')
    const bars = await page.locator('.bar').evaluateAll((items) => items.map((bar) => ({ count: Number(bar.dataset.count), width: Number.parseFloat(bar.style.getPropertyValue('--bar-width')) })))
    assert.deepEqual(bars.map((bar) => bar.count), [3, 1, 2])
    for (const [index, expected] of [100, 100 / 3, 200 / 3].entries()) {
      assert.ok(Math.abs(bars[index].width - expected) < 0.01, `bar ${index} has the expected relative width`)
    }
    assert.deepEqual(await page.locator('#values tr').allTextContents(), ['A3', 'B1', 'C2'])
  }

  await assertChart()
  let renders = 1
  let rowsCreated = 6
  for (const batch of [1, 3, 5]) {
    for (let click = 0; click < batch; click += 1) await page.getByRole('button', { name: 'Render chart again' }).click()
    renders += batch
    rowsCreated += batch * 6
    await assertChart()
    await assert.equal(await page.locator('#stats').textContent(), `Renders: ${renders}; chart and table rows created: ${rowsCreated}.`)
  }
  assert.deepEqual(errors, [])
  process.stdout.write('R54-T048: bar ratios, table values and 1/3/5 render counts passed.\n')
} finally {
  await browser?.close()
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
}
