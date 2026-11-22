import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const schema = {
  name: 'string',
  visits: 'number',
  subscribed: 'boolean',
  nickname: ['string', 'null'],
}

function rejectBigInt(value, seen = new WeakSet()) {
  if (typeof value === 'bigint') {
    throw new TypeError('BigInt is not supported by JSON serialization.')
  }
  if (value === null || typeof value !== 'object' || seen.has(value)) return
  seen.add(value)
  for (const child of Object.values(value)) rejectBigInt(child, seen)
}

export function validateRecord(record) {
  rejectBigInt(record)
  if (record === null || typeof record !== 'object' || Array.isArray(record)) {
    throw new TypeError('Record must be a plain object.')
  }
  const expectedKeys = Object.keys(schema)
  const actualKeys = Object.keys(record)
  if (actualKeys.length !== expectedKeys.length || expectedKeys.some((key) => !Object.hasOwn(record, key))) {
    throw new TypeError(`Record must contain exactly: ${expectedKeys.join(', ')}.`)
  }
  for (const [key, expected] of Object.entries(schema)) {
    const allowed = Array.isArray(expected) ? expected : [expected]
    if (!allowed.includes(record[key] === null ? 'null' : typeof record[key])) {
      throw new TypeError(`Record field "${key}" must be ${allowed.join(' or ')}.`)
    }
    if (typeof record[key] === 'number' && !Number.isFinite(record[key])) {
      throw new TypeError(`Record field "${key}" must be a finite number.`)
    }
  }
  return record
}

// Extracted responsibility: validate the record before serialization and after parsing.
export function roundTripRecord(record) {
  validateRecord(record)
  const json = JSON.stringify(record)
  const restored = JSON.parse(json)
  validateRecord(restored)
  return restored
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const record = { name: 'Ada', visits: 3, subscribed: true, nickname: null }
  console.log(JSON.stringify(roundTripRecord(record)))
}
