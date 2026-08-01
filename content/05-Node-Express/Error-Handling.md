# Error Handling (Node/Express)

## Q
How do you handle errors in async Express routes? Centralized error handling? Uncaught exceptions?

## Answer
Express's built-in error handling only catches synchronous throws in route handlers — a rejected promise inside an `async` function just becomes an unhandled rejection unless something explicitly forwards it. The fix is a thin wrapper (`asyncHandler`) that catches the rejection and calls `next(err)`, so every async route funnels errors into one central 4-arg error middleware that decides the status code and response shape. Process-level `uncaughtException`/`unhandledRejection` listeners are the last resort — not for normal control flow, just so an unexpected crash logs cleanly and exits instead of leaving the process in a corrupted, half-working state.

## Code
Async wrapper (avoid try/catch in every route):
```js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next); // forward to error mw

app.get("/user/:id", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  res.json(user);
}));
```

Custom error class:
```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // known/expected error
  }
}
```

Central error middleware (last):
```js
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";
  if (status >= 500) console.error(err); // log unexpected
  res.status(status).json({ error: message });
});
```

Process-level safety net:
```js
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // let PM2/k8s restart clean
});
```

## How it works
`asyncHandler` wraps a route function, `Promise.resolve()`s its return value, and `.catch(next)`s any rejection — turning an async throw into the same `next(err)` path a sync `throw` would take. The central error middleware then checks `err.isOperational`: known errors (like `AppError("User not found", 404)`) return their real message and status, anything else is treated as a bug and collapsed to a generic 500 so internals never leak to the client.

## Gotchas
- **A `throw` inside an async function without the wrapper is silently swallowed** — it becomes an unhandled rejection, not an Express error, and the request just hangs until timeout.
- **Don't leak `err.stack` or raw messages for non-operational errors** — an unexpected error (DB connection failure, null-pointer bug) should return a generic message to the client and the real detail only to the server log.
- **`process.exit(1)` on `uncaughtException` is deliberate, not a crash to avoid** — the process is in an unknown state after a truly uncaught exception; let the process manager (PM2/k8s) restart it clean rather than keep serving from corrupted state.
- **Distinguish 4xx (client's fault — bad input, missing auth) from 5xx (server's fault)** consistently, so the frontend can tell "retry with different input" from "this is broken."

## Follow-ups
- **"How do you handle validation errors specifically?"** A schema library (Zod/Joi) throws/returns a structured error before the handler runs; map it to `AppError(message, 400)` with field-level detail in the response body.
- **"What about errors in middleware itself, not just route handlers?"** Same rule — sync throws are caught automatically, async ones need the same `.catch(next)` pattern or an async-aware middleware wrapper.
- **"How do you avoid repeating try/catch everywhere?"** That's exactly what `asyncHandler` buys you — one wrapper applied at route registration instead of try/catch duplicated in every handler.

## Related
[[Middleware]] · [[Auth-JWT]]
