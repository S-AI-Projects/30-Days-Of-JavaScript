# Applied Lab (r54-t023): Immutable Array Update by ID

> **Contribution focus**: Inject time, storage, events or network where used; use repeatable local fixtures and show that two isolated runs agree.

This applied lab extends array manipulation and memory reference principles from **Day 5: Arrays** by demonstrating pure, non-mutating updates on collections of objects.

## Explicit Contract

1. **Non-destructive Update**:
   - Updates target item by ID while creating a new array container (`result !== original`).
   - Original array and all original item values remain completely unmodified.
2. **Structural Sharing & Reference Retention**:
   - For all items whose ID does not match the target (`id !== 2`), their exact memory references are retained (`result[i] === original[i]`).
   - Only the matching record (`id === 2`) receives a new object reference with the updated fields.
3. **Absent ID Handling**:
   - If the target ID is not found, the operation leaves contents equivalent to the original array without altering any items.
4. **Deterministic Fixture & Dependency Injection**:
   - Supports injecting external dependencies (time/clock, storage, and event handlers).
   - Guarantees that two separate, isolated runs provided with the identical fixture and clock yield identical outputs.

## Running the Example

Run the local demonstration:

```bash
node 05_Day_Arrays/applied-labs/r54-t023/example.js
```

## Running the Automated Tests

Run the built-in Node.js test suite:

```bash
node --test 05_Day_Arrays/applied-labs/r54-t023/example.test.mjs
```

Test results, inputs, expected versus actual outputs, and tool versions are recorded in `work/R54-T023/`.
