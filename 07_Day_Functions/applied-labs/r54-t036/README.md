# Applied Lab (r54-t036): Function Defaults & Responsibility Extraction

> **Contribution focus**: Start from a working version, capture its behavior and extract one clearly named responsibility without changing the contract.

This applied lab extends **Day 7: Functions** by demonstrating default parameter values, defensive argument validation, and clean refactoring patterns through extracting single-responsibility helper functions while strictly preserving the external contract.

## Explicit Contract

1. **Parameters & Defaults**:
   - `name`: string representing user's name. Blank values (`""`, `"   "`, `null`, `undefined`) are explicitly rejected with an Error.
   - `language`: optional string code for salutation language. Defaults to `'en'`.
2. **Expected Outputs**:
   - `greet("Ada", "en")` → `"Hello, Ada!"`
   - `greet("Ada")` (omitted language) → `"Hello, Ada!"`
   - `greet("  ")` → Throws `'Name cannot be blank'`
3. **Refactoring & Extracted Responsibility**:
   - Initial implementation: `greetInitial(name, language)`
   - Extracted helper: `resolveSalutation(language)` isolating salutation mapping and default fallback.
   - Extracted helper: `validateName(name)` isolating input validation.
   - Refactored function: `greet(name, language = 'en')` orchestrating both helpers while maintaining identical behavior.

## Running the Example

```bash
node 07_Day_Functions/applied-labs/r54-t036/example.js
```

## Running the Automated Checks

```bash
node --test 07_Day_Functions/applied-labs/r54-t036/example.test.mjs
```
