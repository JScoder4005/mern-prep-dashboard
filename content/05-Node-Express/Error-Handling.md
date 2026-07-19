# Error Handling (Node/Express)

## Q
How do you handle errors in async Express routes? Centralized error handling? Uncaught exceptions?

## A
Wrap async handlers so rejected promises reach Express's error middleware. Use one central error handler. Handle process-level `uncaughtException`/`unhandledRejection` for safety net.

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

## How
`.catch(next)` passes rejection to Express, which routes to the 4-arg error handler. Operational vs programmer errors distinguished — hide internal details from client.

## Why
- No leaking stack traces to users (security).
- Consistent error shape for frontend.
- Crashed process should restart, not run corrupted.

## Where / Scenario
- Every REST API — global error format.
- Validation errors → 400, auth → 401/403, not found → 404, server → 500.
- Don't swallow errors silently.

## Related
[[Middleware]] · [[Auth-JWT]]
