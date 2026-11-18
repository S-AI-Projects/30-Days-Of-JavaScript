# Applied Lab (r54-t032): Closure Isolation & Boundary Validation

> **Contribution focus**: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.

This applied lab extends **Day 19: Closures** by demonstrating instance-level variable encapsulation and boundary validation. Two independent counter closures maintain private lexical environments, ensuring that operations on one instance do not contaminate or leak into another instance, and defensive validation ensures out-of-boundary inputs are safely rejected.

## Explicit Contract

1. **Closure Encapsulation**:
   - Each counter is created via `createCounter(initialValue)`.
   - Internal variable `count` is privately enclosed within the closure scope and not exposed on the global object or prototype.
2. **Instance Isolation**:
   - Incrementing Counter A twice increases Counter A's value to `2`.
   - Counter B remains strictly at `0`.
3. **Boundary Condition & Empty/Invalid Input Handling**:
   - **Valid Boundary**: Step values must be positive integers (`step > 0`).
   - **Invalid Inputs**: Empty inputs (`""`), non-numeric values (`"abc"`), negative values (`-5`), and decimals (`1.5`) are rejected with descriptive errors (`TypeError` / `RangeError`) without modifying the internal counter state.

## Running the Example

Start the local standalone web server:

```bash
node 19_Day_Closures/applied-labs/r54-t032/example.js
```

## Running the Automated Checks

Run the automated Playwright validation suite:

```bash
node 19_Day_Closures/applied-labs/r54-t032/check.mjs
```
