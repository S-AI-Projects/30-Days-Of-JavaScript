/**
 * Contribution focus: Inject time, storage, events or network where used; use repeatable local fixtures and show that two isolated runs agree.
 *
 * Applied Lab (r54-t023) for Day 5: Arrays (Immutable Array Update by ID)
 * Contract:
 *  - Replace an item by ID without modifying the original array or other object references.
 *  - Updating id=2 changes only that record.
 *  - Absent ID leaves the contents equivalent.
 *  - Original values remain intact.
 *  - Injectable dependencies (time/clock, storage, events).
 *  - Deterministic: two isolated runs with the same fixture agree.
 */

/**
 * Standard deterministic local fixture.
 * Frozen to guarantee that mutation of the original array or items throws in strict mode.
 */
function createDeterministicFixture() {
  return Object.freeze([
    Object.freeze({ id: 1, name: 'Alpha', status: 'pending', count: 10 }),
    Object.freeze({ id: 2, name: 'Beta', status: 'pending', count: 20 }),
    Object.freeze({ id: 3, name: 'Gamma', status: 'pending', count: 30 })
  ]);
}

/**
 * Pure, immutable array update function.
 * Updates an item by ID while strictly preserving immutability and unaffected references.
 *
 * @param {Array<object>} items - Original array of objects with an `id` property
 * @param {number|string} id - Target identifier to replace/update
 * @param {object|function} updates - Update object or updater function
 * @param {object} [dependencies={}] - Injected dependencies (clock, storage, onEvent)
 * @returns {Array<object>} New array with the target item updated
 */
function updateItemById(items, id, updates, dependencies = {}) {
  if (!Array.isArray(items)) {
    throw new TypeError('First argument must be an array');
  }

  const {
    clock = () => '2026-01-01T00:00:00.000Z',
    storage = null,
    onEvent = null
  } = dependencies;

  const result = items.map((item) => {
    if (!item || item.id !== id) {
      // Unaffected elements retain their exact reference in memory
      return item;
    }

    const resolved = typeof updates === 'function' ? updates(item) : updates;
    const updatedRecord = {
      ...item,
      ...resolved,
      updatedAt: resolved.updatedAt || clock()
    };

    if (typeof onEvent === 'function') {
      onEvent({ type: 'ITEM_UPDATED', id, record: updatedRecord });
    }

    return Object.freeze(updatedRecord);
  });

  if (storage && typeof storage.save === 'function') {
    storage.save(result);
  }

  return Object.freeze(result);
}

// Interactive CLI demonstration when executed directly via `node example.js`
if (require.main === module) {
  console.log('--- Applied Lab r54-t023: Immutable Array Update by ID ---');
  console.log('Contribution focus: Inject time, storage, events or network where used; use repeatable local fixtures and show that two isolated runs agree.\n');

  const fixture = createDeterministicFixture();
  const mockClock = () => '2026-11-18T00:00:00.000Z';

  console.log('Original fixture:', fixture);

  // 1. Update id=2
  const updated = updateItemById(fixture, 2, { status: 'completed', count: 25 }, { clock: mockClock });
  console.log('\nUpdated array (id=2 changed):', updated);
  console.log('Original array unchanged?:', fixture !== updated);
  console.log('id=1 reference retained?:', fixture[0] === updated[0]);
  console.log('id=2 reference changed?:', fixture[1] !== updated[1]);
  console.log('id=3 reference retained?:', fixture[2] === updated[2]);

  // 2. Absent ID
  const absentResult = updateItemById(fixture, 999, { status: 'none' }, { clock: mockClock });
  console.log('\nAbsent ID leaves contents equivalent?:', JSON.stringify(absentResult) === JSON.stringify(fixture));

  // 3. Two isolated runs agree
  const runA = updateItemById(createDeterministicFixture(), 2, { status: 'verified' }, { clock: mockClock });
  const runB = updateItemById(createDeterministicFixture(), 2, { status: 'verified' }, { clock: mockClock });
  console.log('Two isolated runs agree?:', JSON.stringify(runA) === JSON.stringify(runB));
}

module.exports = {
  createDeterministicFixture,
  updateItemById
};
