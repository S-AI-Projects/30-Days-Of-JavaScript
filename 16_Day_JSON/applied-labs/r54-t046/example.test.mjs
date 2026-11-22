import assert from 'node:assert/strict'
import test from 'node:test'
import { roundTripRecord, validateRecord } from './example.js'

const fixture = { name: 'Ada', visits: 3, subscribed: true, nickname: null }

test('round-trips string, number, boolean, and null fields without changing the contract', () => {
  const restored = roundTripRecord(fixture)
  assert.deepEqual(restored, fixture)
  assert.equal(typeof restored.name, 'string')
  assert.equal(typeof restored.visits, 'number')
  assert.equal(typeof restored.subscribed, 'boolean')
  assert.equal(restored.nickname, null)
})

test('rejects BigInt with a documented JSON limitation', () => {
  assert.throws(
    () => roundTripRecord({ ...fixture, extra: 1n }),
    { name: 'TypeError', message: 'BigInt is not supported by JSON serialization.' },
  )
})

test('validates the record schema explicitly', () => {
  assert.throws(() => validateRecord({ ...fixture, visits: '3' }), /visits.*number/)
  assert.throws(() => validateRecord({ ...fixture, extra: 'field' }), /exactly/)
})
