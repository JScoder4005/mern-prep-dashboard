# Async, Promises, async/await

## Q
Explain Promises and async/await. What's the difference between `Promise.all`, `allSettled`, `race`, and `any`?

## Answer
A Promise is an object representing a value that isn't ready yet — it moves once from `pending` to either `fulfilled` or `rejected`. `async/await` is syntax sugar over promises: `await` pauses the async function until the awaited promise settles, without blocking the thread, and lets you write async code that reads top-to-bottom with ordinary `try/catch`. The four combinators differ in *when* they settle: `all` waits for every promise but fast-fails on the first rejection, `allSettled` waits for all and never rejects, `race` settles as soon as the first one does (fulfil or reject), and `any` returns the first fulfilment and only rejects if every one fails.

## How it works
`await` registers a `.then` callback on the promise, yields control back to the event loop, and resumes the function as a *microtask* once the promise settles — so nothing after an `await` runs synchronously (see [[Event-Loop]]). Because `await` pauses, awaiting promises one after another runs the work serially; starting them first and awaiting a single `Promise.all` runs them concurrently.

## Code
Basic await and ordering:
```js
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
async function run() {
  console.log("start");
  await wait(10);
  console.log("after await"); // resumes as a microtask when the timer fires
  return "done";
}
run().then((r) => console.log("resolved:", r));
// start
// after await
// resolved: done
```

Serial vs parallel — same work, half the time:
```js
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
async function serial() {
  const t = Date.now();
  await wait(15);
  await wait(15);          // second starts only after the first finishes
  return Date.now() - t;   // ~30ms
}
async function parallel() {
  const t = Date.now();
  await Promise.all([wait(15), wait(15)]); // both start immediately
  return Date.now() - t;   // ~15ms
}
Promise.all([serial(), parallel()]).then(([s, p]) =>
  console.log(`serial ~${s}ms, parallel ~${p}ms`));
```

The four combinators:
```js
const ok = (v, ms = 0) => new Promise((res) => setTimeout(() => res(v), ms));
const fail = (e) => Promise.reject(e);
Promise.all([ok("a"), ok("b")]).then((r) => console.log("all:", r));
Promise.allSettled([ok("a"), fail("x")]).then((r) =>
  console.log("allSettled:", r.map((s) => s.status)));
Promise.race([ok("fast", 0), ok("slow", 40)]).then((r) => console.log("race:", r));
Promise.any([fail("x"), ok("win")]).then((r) => console.log("any:", r));
// all: ["a","b"]
// allSettled: ["fulfilled","rejected"]
// race: fast
// any: win
```

## Gotchas
- Code after `await` runs as a microtask, not synchronously — a `console.log` before the `await` and one after do **not** run back-to-back.
- `array.forEach(async …)` does **not** wait — the loop fires every callback and moves on. Use `for...of` with `await` for sequential, or `await Promise.all(array.map(…))` for parallel.
- `Promise.all` fast-fails: one rejection discards the other results. Use `allSettled` when you need every outcome.
- An unhandled rejection (no `.catch` / surrounding `try`) crashes Node and warns in the browser — always handle the reject path.

## Follow-ups
- **"race vs any?"** `race` settles on the *first to settle* (a fast rejection can win); `any` ignores rejections and returns the *first fulfilment*.
- **"How do you add a timeout to a fetch?"** `Promise.race([fetch(url), wait(5000).then(() => { throw new Error("timeout"); })])`.
- **"Does `await` block the thread?"** No — it only pauses that async function; the event loop keeps running everything else.

## Related
[[Event-Loop]] · [[Polyfills]]
