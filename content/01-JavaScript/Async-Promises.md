# Async, Promises, async/await

## Q
Explain Promises and async/await. Difference between `Promise.all`, `allSettled`, `race`, `any`?

## A
A Promise = object representing a future value: `pending → fulfilled | rejected`. `async/await` is syntax sugar over promises — `await` pauses the async function until the promise settles, without blocking the thread.

## Code
```js
// Basic
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
async function run() {
  await wait(1000);
  return "done";
}

// SERIAL vs PARALLEL (common senior question)
async function serial() {   // ~2s total
  const a = await wait(1000);
  const b = await wait(1000);
}
async function parallel() { // ~1s total
  const [a, b] = await Promise.all([wait(1000), wait(1000)]);
}

// error handling
async function safe() {
  try {
    const data = await fetch("/api").then(r => r.json());
    return data;
  } catch (err) {
    console.error(err);
  }
}
```

## Combinators
| Method | Resolves when | Rejects when | Returns |
|---|---|---|---|
| `all` | ALL fulfil | ANY rejects (fast-fail) | array of results |
| `allSettled` | ALL settle | never | `{status,value/reason}[]` |
| `race` | first settles | first settles (if reject) | first result |
| `any` | first fulfils | ALL reject | first success / AggregateError |

```js
Promise.all([p1, p2]);         // all-or-nothing
Promise.allSettled([p1, p2]);  // want every outcome, ignore failures
Promise.race([p, timeout]);    // add a timeout to a request
Promise.any([mirror1, mirror2]); // first successful mirror
```

## How
`await` registers a `.then` microtask, yields control to event loop, resumes when settled. See [[Event-Loop]].

## Why
Avoids callback hell, linear readable async, proper error propagation via try/catch.

## Where / Scenario
- `Promise.all` — fetch user + orders + cart together.
- `allSettled` — batch notifications, don't fail all if one fails.
- `race` — request timeout.
- Bug: `forEach` doesn't await — use `for...of` or `Promise.all(map)`.

## Related
[[Event-Loop]] · [[Polyfills]]
