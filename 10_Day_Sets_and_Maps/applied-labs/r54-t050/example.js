import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export function summarizeTags(tags) {
  if (!Array.isArray(tags)) throw new TypeError('Tags must be an array.')

  const counts = new Map()
  const unique = new Set()
  for (const tag of tags) {
    if (typeof tag !== 'string') throw new TypeError('Every tag must be a string.')
    const normalized = tag.trim().toLowerCase()
    if (normalized === '') continue
    unique.add(normalized)
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1)
  }

  return { counts, uniqueTags: [...unique] }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { counts, uniqueTags } = summarizeTags(['JS', 'js', 'Python'])
  console.log('Counts:', Object.fromEntries(counts))
  console.log('Unique tags:', uniqueTags)
}
