# Applied Lab: Module Packaging & Input-Scale Experiment (R54-T029)

## Overview
- **Student**: ABHINANDAN RATHORE
- **Task ID**: R54-T029 · 9 of 10
- **Topic**: Day 20 — Writing Clean Codes (Input-Scale Experiment)
- **Contribution Focus**: *Check three bounded input sizes or repeated interaction counts; assert correctness and report operation counts or render/listener counts rather than imposing a speed threshold.*

---

## Contract & Specifications

1. **Explicit Public API**:
   - `formatNumber(value, options)`: Pure deterministic number formatter.
   - `formatCurrency(value, currency, locale, options)`: Formats monetary values with currency symbol.
   - `formatBatch(items, options)`: Processes arrays of numbers and records operation counts.
   - `runScaleExperiment(sizes, options)`: Executes scale experiments across three bounded sizes.
   - `startServer(port)`: Starts a local HTTP server for interactive UI exploration.

2. **Zero Side-Effect Module Import**:
   - Importing/requiring `example.js` causes zero DOM mutations, zero window leaks, and zero network calls.

3. **Repeatable Formatting**:
   - Formatting `1234.5` with an explicit locale is deterministic:
     - `formatNumber(1234.5, { locale: 'en-US' })` $\rightarrow$ `'1,234.5'`
     - `formatNumber(1234.5, { locale: 'de-DE' })` $\rightarrow$ `'1.234,5'`
     - `formatCurrency(1234.5, 'USD', 'en-US')` $\rightarrow$ `'$1,234.50'`

4. **Input-Scale Experiment (No Speed Threshold)**:
   - Three bounded sizes tested: **10**, **50**, and **100** items.
   - Verifies 100% output correctness across all inputs.
   - Reports exact operation counts (10, 50, 100) and DOM render/listener counts rather than imposing arbitrary timing/speed thresholds.

---

## Running the Application

### 1. Interactive Demo
```bash
node 20_Day_Writing_clean_codes/applied-labs/r54-t029/example.js
```
Open `http://localhost:3000` to interact with the single formatter and trigger the scale experiment buttons.

### 2. Automated Playwright Validation
```bash
NODE_PATH=/opt/homebrew/lib/node_modules node 20_Day_Writing_clean_codes/applied-labs/r54-t029/check.mjs
```
All assertion results, operation counts, and tool versions will be recorded in:
- `work/R54-T029/results.json`
- `work/R54-T029/results.md`
