# Promise state transitions

This local lab uses an injected asynchronous loader and renders `idle`, `pending`, `ready`, and `error` states. The fixture is delayed, never calls a network, and `retry` fails once then succeeds. A trimmed blank name is rejected before the loader runs; an `empty` response reaches `ready` with a clear empty-state message.

Open `index.html` in a browser. For browser assertions, run:

```sh
node 18_Day_Promises/applied-labs/r54-t042/check.mjs
```
