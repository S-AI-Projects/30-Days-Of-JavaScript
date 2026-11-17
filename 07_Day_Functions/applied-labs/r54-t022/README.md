# Applied Lab (r54-t022): Function Defaults & Boundary Validation

> **Contribution focus**: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.

This applied lab extends the function and default parameter concepts from **Day 7: Functions** by implementing a greeting function with a default language parameter and strict, defensive boundary validation for input names.

## Explicit Contract

1. **Explicit Language Input**:
   - `name='Ada', language='en'` produces `'Hello, Ada!'`
2. **Default Language Fallback**:
   - When the `language` argument is omitted (or `undefined`), it defaults to `'en'`.
   - `greet('Ada')` produces `'Hello, Ada!'`
3. **Boundary Condition & Rejection**:
   - Blank names are strictly rejected with an `Error`.
   - **Boundary Case 1: Empty string (`""`)**: A zero-character string is rejected (`Error: Name cannot be blank`).
   - **Boundary Case 2: Whitespace-only string (`"   "`)**: Strings with only spaces, tabs, or newlines are trimmed and rejected (`Error: Name cannot be blank`).
   - **Boundary Case 3: Invalid data types**: Passing `null`, `undefined`, numbers, or non-strings is rejected (`TypeError: Name must be a string`).
4. **Multi-language Support**:
   - Supported languages include `'en'` (`Hello`), `'es'` (`Hola`), `'fr'` (`Bonjour`), and `'de'` (`Hallo`).
   - Passing an unsupported language code throws an error.

## Running the Example

Run the local demonstration:

```bash
node 07_Day_Functions/applied-labs/r54-t022/example.js
```

## Running the Automated Tests

Run the built-in Node.js test suite:

```bash
node --test 07_Day_Functions/applied-labs/r54-t022/example.test.mjs
```

Test results, inputs, expected versus actual outputs, and tool versions are recorded in `work/R54-T022/`.
