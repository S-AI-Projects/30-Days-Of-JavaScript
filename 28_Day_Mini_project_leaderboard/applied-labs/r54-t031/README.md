# Applied Lab (r54-t031): Local Chart Dashboard

> **Contribution Focus:** Implement the required behavior from the explicit contract; show the smallest useful complete example.

## Overview

This lab extends **Day 28: Mini Project Leaderboard** by implementing a small local chart dashboard that switches between supplied data series (`A`, `B`, and `EMPTY`) while reusing existing DOM row nodes in place.

## Explicit Contract

1. **No DOM Node Duplication:** Switching between Series `A` and Series `B` updates existing `.chart-row` elements in place rather than appending duplicate rows.
2. **Round-Trip Restoration:** Switching `A` → `B` → `A` restores the exact original Series `A` values (`Alpha: 42`, `Beta: 78`, `Gamma: 55`).
3. **Empty Data Handling:** Selecting `EMPTY` hides the chart rows and displays an explicit no-data message (`No data available for the selected series.`).

## Running the Example

```bash
node 28_Day_Mini_project_leaderboard/applied-labs/r54-t031/example.js
```

## Running the Automated Checks

```bash
node 28_Day_Mini_project_leaderboard/applied-labs/r54-t031/check.mjs
```
