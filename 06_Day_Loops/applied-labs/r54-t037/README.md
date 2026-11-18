# Applied Lab (r54-t037): Consecutive Symbol Counting via Explicit Loops

> **Contribution focus**: Add a worked explanation from input through intermediate state to output, and make the published example executable by the test.

This applied lab extends **Day 6: Loops** by implementing an explicit loop construct to group and count consecutive occurrences of symbols in strings, accompanied by an explicit worked explanation tracing state transitions across every iteration.

## Explicit Contract

1. **Consecutive Symbol Counting**:
   - Given `"aaabbc"`, output is `[{ symbol: "a", count: 3 }, { symbol: "b", count: 2 }, { symbol: "c", count: 1 }]`.
   - Given an empty string `""`, output is `[]`.
2. **Explicit Loop Iteration**:
   - Traversal uses an explicit indexed `for` loop to inspect sequential characters and detect boundary transitions between distinct symbols.
3. **Worked Explanation Pipeline**:
   - Traces the state at each step: `Input` → `Intermediate Loop State (currentSymbol, currentCount, emitted)` → `Final Output`.

## State Transition Table

| Step | Index | Character | Action | Current Group | Emitted Groups |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **0** | 0 | `'a'` | Initialize | `{ symbol: 'a', count: 1 }` | `[]` |
| **1** | 1 | `'a'` | Increment | `{ symbol: 'a', count: 2 }` | `[]` |
| **2** | 2 | `'a'` | Increment | `{ symbol: 'a', count: 3 }` | `[]` |
| **3** | 3 | `'b'` | Flush & Reset | `{ symbol: 'b', count: 1 }` | `[{ symbol: 'a', count: 3 }]` |
| **4** | 4 | `'b'` | Increment | `{ symbol: 'b', count: 2 }` | `[{ symbol: 'a', count: 3 }]` |
| **5** | 5 | `'c'` | Flush & Reset | `{ symbol: 'c', count: 1 }` | `[{ symbol: 'a', count: 3 }, { symbol: 'b', count: 2 }]` |
| **End**| - | `EOF` | Final Flush | - | `[{ symbol: 'a', count: 3 }, { symbol: 'b', count: 2 }, { symbol: 'c', count: 1 }]` |

## Running the Example

```bash
node 06_Day_Loops/applied-labs/r54-t037/example.js
```

## Running the Automated Checks

```bash
node --test 06_Day_Loops/applied-labs/r54-t037/example.test.mjs
```
