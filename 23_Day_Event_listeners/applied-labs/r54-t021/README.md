# Applied Lab (r54-t021): Event Lifecycle & Cleanup

> **Contribution focus**: Implement the required behavior from the explicit contract; show the smallest useful complete example.

This applied lab extends the event handling concepts from **Day 23: Event Listeners** by demonstrating proper event lifecycle management: attaching a button handler once, safely remounting without duplicating listeners, supporting keyboard activation, and exposing cleanup to prevent memory leaks and unwanted updates.

## Explicit Contract

1. **Single Handler Attachment**:
   - The button click handler is attached once upon mount.
   - One click increments the counter display by exactly 1 (`0 -> 1`).
2. **Keyboard Activation**:
   - The button is accessible via standard keyboard activation (`Enter` and `Space` keys when focused), incrementing the counter by 1 per activation.
3. **Idempotent Remounting**:
   - Calling remount (or repeatedly remounting) cleans up any existing listener before attaching a new one.
   - Remounting does not duplicate handlers (a subsequent click still increments by exactly 1).
4. **Cleanup & Prevention of Updates**:
   - Exposes a `cleanup()` method (and UI Cleanup button).
   - Once cleaned up, event listeners are detached, and clicking or keyboard-activating the button prevents further count updates.
   - Status updates dynamically to reflect `'Mounted'` or `'Cleaned up'`.

## Running the Example

Start the local standalone application:

```bash
node 23_Day_Event_listeners/applied-labs/r54-t021/example.js
```

## Running the Automated Checks

Run the automated Playwright validation suite:

```bash
node 23_Day_Event_listeners/applied-labs/r54-t021/check.mjs
```

Test results, inputs, expected versus actual outputs, and tool versions are recorded in `work/R54-T021/`.
