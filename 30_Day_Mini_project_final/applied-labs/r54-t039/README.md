# Applied Lab (r54-t039): Capstone State Restoration & Input-Scale Experiment

> **Contribution Focus:** Check three bounded input sizes or repeated interaction counts; assert correctness and report operation counts or render/listener counts rather than imposing a speed threshold.

## Overview

This lab extends **Day 30: Mini Project Final** with a persistent task board backed by versioned `localStorage` (`v1`), corruption recovery, and a bounded 3-size input-scale experiment (`N = 5, 20, 50`).

## Explicit Contract

1. **Add, Complete, Reload & Filter:** Adding two tasks, completing one, reloading the page, and filtering `Completed` displays only the completed task.
2. **Corrupt Storage Recovery:** Invalid JSON or mismatched schema versions in `localStorage` are caught gracefully, displaying a recovery warning without crashing.
3. **Bounded Scale Experiment:** Evaluates `N = 5, 20, 50` tasks, asserting exact restored and completed counts while reporting operation counts.

## Running the Example

```bash
node 30_Day_Mini_project_final/applied-labs/r54-t039/example.js
```

## Running the Automated Checks

```bash
node 30_Day_Mini_project_final/applied-labs/r54-t039/check.mjs
```
