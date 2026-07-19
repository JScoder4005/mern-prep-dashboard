# Express Middleware

## Q
What is middleware? Explain the chain, order, `next()`. Types of middleware.

## A
Middleware = function `(req, res, next)` running in order for each request. Can read/modify req/res, end the response, or call `next()` to pass control. Order matters.

## Code
```js
const express = require("express");
const app = express();

// application-level
app.use(express.json());                 // body parser (built-in)

// custom logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();                                 // MUST call or request hangs
});

// auth middleware (route-level)
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "no token" });
  req.user = verify(token);               // attach to req
  next();
}
app.get("/profile", auth, (req, res) => res.json(req.user));

// error-handling middleware = 4 ARGS (must be last)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});
```

## Types
| Type | Example |
|---|---|
| Application-level | `app.use(fn)` |
| Router-level | `router.use(fn)` |
| Built-in | `express.json()`, `express.static()` |
| Third-party | `cors`, `helmet`, `morgan` |
| Error-handling | 4-arg `(err,req,res,next)` |

## How
Express keeps a stack; each `next()` advances to the next matching middleware/route. Sending response without `next()` ends the chain. `next(err)` jumps to error handler.

## Why
Cross-cutting concerns (auth, logging, validation, CORS) in one reusable place. Composable pipeline.

## Where / Scenario
- Auth guard on protected routes: see [[Auth-JWT]].
- Request validation, rate limiting, CORS, security headers (helmet).
- Centralized error handling: see [[Error-Handling]].

## Gotchas
- Order: `express.json()` before routes that read `req.body`.
- Error middleware must be registered **last**.
- Forgetting `next()` → request hangs.

## Related
[[Auth-JWT]] · [[Error-Handling]]
