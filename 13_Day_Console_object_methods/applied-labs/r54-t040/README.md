# Applied Lab (r54-t040): Diagnostic Separation & Logger Injection

> **Contribution focus**: Create a temporary one-line mutant of the decisive condition; add a focused test that passes on the correct example and fails on that mutant.

This applied lab extends **Day 13: Console Object Methods** by demonstrating proper diagnostic separation. Instead of hard-coding `console.log()` side-effects inside domain logic, diagnostic reporting is decoupled and routed through an injected logger interface. Disabling or omitting the logger leaves the public computation output completely unaffected.

## Explicit Contract

1. **Injected Logger Diagnostics**:
   - When a logger is passed, it receives a structured diagnostic event: `{ type: 'DISCOUNT_EVALUATION', subtotal, qualifies, discount, total }`.
   - When the logger is omitted (`null`), disabled, or not supplied, the public calculation result is identical in structure and value.
2. **Decisive Condition**:
   - `subtotal >= 100`: Qualifies for a 10% discount (`qualifies: true, discount: 10, total: 90`).
   - `subtotal < 100`: Does not qualify (`qualifies: false, discount: 0, total: subtotal`).
3. **Mutation Testing**:
   - **Correct Condition**: `subtotal >= DISCOUNT_THRESHOLD`
   - **One-line Mutant**: `subtotal > DISCOUNT_THRESHOLD` (fails at the boundary of `100`).
   - A dedicated focused test verifies that the boundary test passes against the correct implementation and fails against the mutant.

## Running the Example

```bash
node 13_Day_Console_object_methods/applied-labs/r54-t040/example.js
```

## Running the Automated Checks

```bash
node --test 13_Day_Console_object_methods/applied-labs/r54-t040/example.test.mjs
```
