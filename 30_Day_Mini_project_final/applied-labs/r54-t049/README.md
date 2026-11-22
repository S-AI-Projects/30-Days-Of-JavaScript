# Versioned local task board

Add tasks, complete or undo them, and filter by all, active, or completed. State is saved as JSON under `r54-t049.tasks` with schema version 1. Invalid JSON, an unknown version, or malformed task records are discarded with a status message.

Open `index.html` in a browser. The browser check is:

```sh
node 30_Day_Mini_project_final/applied-labs/r54-t049/check.mjs
```
