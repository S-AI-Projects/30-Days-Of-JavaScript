import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { parseStoredTasks, serializeTasks, visibleTasks } from './logic.mjs'

// The reference fixture makes the completed-filter condition explicit.
const fixture = [
  { id: 'a', label: 'Buy milk', completed: true },
  { id: 'b', label: 'Read docs', completed: false },
]
const expectedCompleted = [fixture[0]]
assert.deepEqual(visibleTasks(fixture, 'completed'), expectedCompleted)

// Temporary one-line mutant: reverse the decisive completed predicate and prove the focused assertion catches it.
const logicSource = await readFile(new URL('./logic.mjs', import.meta.url), 'utf8')
const mutantSource = logicSource.replace('tasks.filter((task) => task.completed)', 'tasks.filter((task) => !task.completed)')
assert.notEqual(mutantSource, logicSource, 'the one-line completed-filter mutant must be applied')
const mutant = await import(`data:text/javascript;base64,${Buffer.from(mutantSource).toString('base64')}`)
assert.throws(() => assert.deepEqual(mutant.visibleTasks(fixture, 'completed'), expectedCompleted), assert.AssertionError)

const storageRoundTrip = serializeTasks(fixture)
assert.deepEqual(parseStoredTasks(storageRoundTrip), { tasks: fixture, corrupt: false })
assert.deepEqual(parseStoredTasks('{not valid json'), { tasks: [], corrupt: true })
assert.deepEqual(parseStoredTasks(JSON.stringify({ version: 99, tasks: fixture })), { tasks: [], corrupt: true })

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
  await page.evaluate(() => localStorage.setItem('r54-t049.tasks', '{broken'))
  await page.reload()
  await assert.equal(await page.getByRole('status').textContent(), 'Saved tasks were invalid, so the board was reset.')

  const input = page.getByLabel('New task')
  for (const task of ['Buy milk', 'Read docs']) {
    await input.fill(task)
    await page.getByRole('button', { name: 'Add task' }).click()
  }
  await page.getByRole('button', { name: 'Complete: Buy milk' }).click()
  await page.reload()
  await page.getByRole('button', { name: 'Completed' }).click()
  const visible = await page.locator('#tasks li span').allTextContents()
  await assert.deepEqual(visible, ['Buy milk'])
  await assert.deepEqual(errors, [])
  process.stdout.write('R54-T049: add, complete, versioned persistence, corrupt storage, filter and mutant checks passed.\n')
} finally {
  await browser?.close()
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
}
