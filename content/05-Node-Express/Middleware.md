# Express Middleware

## Q
What is middleware? Explain the chain, order, `next()`. Types of middleware.

## Answer
Middleware is just a function `(req, res, next)` that Express calls in registration order for every matching request. Each one can inspect or mutate `req`/`res`, end the response itself, or call `next()` to hand off to the next function in the stack — nothing runs after it unless it does. Order is the whole design: a body parser must run before any handler that reads `req.body`, auth must run before the protected route, and the 4-arg error handler must be registered last so `next(err)` has somewhere to land.

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

## How it works
Express maintains an ordered stack of registered middleware/routes. Calling `next()` advances to the next entry that matches the request's path/method; sending a response (`res.json`, `res.send`, etc.) ends the chain without needing `next()`. Calling `next(err)` skips every remaining normal middleware and jumps straight to the first 4-arg `(err, req, res, next)` handler — which is why that handler has to be registered last, after every route it's meant to catch errors from.

## Gotchas
- **Forgetting to call `next()`** in a pass-through middleware hangs the request forever — no response, no error, just a stuck connection.
- **`express.json()` must come before any route that reads `req.body`** — routes registered earlier see `undefined`.
- **Error-handling middleware must be last and must have exactly 4 params** — Express detects it as an error handler by arity, not by name.
- **Calling `next()` after already sending a response** ("headers already sent") — easy to trigger if a callback fires after an early `return res.json(...)` without actually returning.

## Follow-ups
- **"How would you validate request bodies consistently?"** Router-level middleware running a schema (Zod/Joi) before the handler, calling `next(new AppError(...))` on failure — see [[Error-Handling]].
- **"Where does an auth check belong?"** Route-level middleware inserted between the path and the handler (`app.get("/profile", auth, handler)`), not baked into every handler — see [[Auth-JWT]].
- **"Can middleware run only for a group of routes?"** Yes — `router.use(fn)` on an `express.Router()` mounted at a path prefix, or `app.use("/admin", auth)` scoped to that prefix.

## Related
[[Auth-JWT]] · [[Error-Handling]]
