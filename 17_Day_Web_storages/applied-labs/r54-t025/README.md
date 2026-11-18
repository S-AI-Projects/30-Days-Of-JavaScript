# Applied Lab (r54-t025): Versioned Local Storage & Graceful Recovery

> **Contribution focus**: Add a worked explanation from input through intermediate state to output, and make the published example executable by the test.

This applied lab extends client-side persistence concepts from **Day 17: Web Storages** by demonstrating robust storage serialization, schema versioning, and defensive error recovery for web applications.

## Explicit Contract

1. **Versioned Settings Schema**:
   - Settings are stored with an explicit schema version: `{ version: 1, theme: 'light'|'dark', fontSize: 'medium' }`.
   - Default fallback settings: `{ version: 1, theme: 'light', fontSize: 'medium' }`.
2. **Graceful Error Recovery**:
   - **Valid Stored Theme**: Persisted `{ version: 1, theme: 'dark' }` successfully reloads and applies the dark theme.
   - **Malformed JSON**: Broken JSON strings (e.g. `'{bad-json:'`) are caught gracefully without uncaught exceptions, falling back to default theme `'light'`.
   - **Unknown Schema Version**: Settings with unknown versions (e.g. `{ version: 999 }`) are rejected and fall back to default theme `'light'`.
   - **Missing Storage**: Empty storage (`null`/`undefined`) cleanly initialises with default theme `'light'`.

## Worked Explanation (State Transition Pipeline)

| Phase | Description | Example 1 (Valid) | Example 2 (Malformed) | Example 3 (Unknown Version) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Input** | Raw string retrieved from `localStorage.getItem('user_settings')` | `'{"version":1,"theme":"dark"}'` | `'{corrupted-data'` | `'{"version":999,"theme":"neon"}'` |
| **2. Intermediate State** | JSON parsing & version compatibility verification | - `parsed = true`<br>- `validVersion = true`<br>- `fallbackReason = null` | - `parsed = false` (SyntaxError)<br>- `validVersion = false`<br>- `fallbackReason = 'Malformed JSON'` | - `parsed = true`<br>- `validVersion = false` (999 ≠ 1)<br>- `fallbackReason = 'Unknown schema version'` |
| **3. Output** | Effective resolved settings applied to UI | `{ version: 1, theme: 'dark' }` (Theme: **dark**) | `{ version: 1, theme: 'light' }` (Theme: **light**) | `{ version: 1, theme: 'light' }` (Theme: **light**) |

## Running the Example

Start the local standalone application:

```bash
node 17_Day_Web_storages/applied-labs/r54-t025/example.js
```

## Running the Automated Checks

Run the automated Playwright verification suite:

```bash
node 17_Day_Web_storages/applied-labs/r54-t025/check.mjs
```

Test results, inputs, expected versus actual outputs, and tool versions are recorded in `work/R54-T025/`.
