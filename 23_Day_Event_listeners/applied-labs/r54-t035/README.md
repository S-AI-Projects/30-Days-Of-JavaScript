# Applied Lab (r54-t035): Event Lifecycle & Deterministic Fixture Lab

> **Contribution Focus:** Inject time, storage, events or network where used; use repeatable local fixtures and show that two isolated runs agree.

## Overview

This lab extends **Day 23: Event Listeners** by demonstrating clean listener registration, keyboard activation (`Enter`/`Space`), idempotent remounting without duplicate handlers, and explicit listener cleanup.

## Explicit Contract

1. **Single Activation:** One click increments the counter by `1`; pressing `Enter` or `Space` on the focused button also increments by `1`.
2. **Idempotent Remount:** Remounting removes prior listeners before re-attaching, so a subsequent click still increments by `1` (no duplicate handlers).
3. **Cleanup:** Calling cleanup detaches listeners so further clicks have no effect.
4. **Deterministic Fixtures:** Running two isolated fixture instances with an injected clock and synthetic events produces identical serialized states (`AGREE`).

## Running the Example

```bash
node 23_Day_Event_listeners/applied-labs/r54-t035/example.js
```

## Running the Automated Checks

```bash
node 23_Day_Event_listeners/applied-labs/r54-t035/check.mjs
```
