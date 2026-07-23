# Closures

## Q
What is a closure? Give a real use case.

## Answer
A closure is a function bundled with the variables from the scope where it was *defined* — so it keeps reading and writing those variables even after the outer function has returned. In practice I reach for closures whenever I need private state that survives across calls: counters, memo caches, debounce timers, or a factory that pre-bakes config into a function.

## How it works
When a function is created it captures a reference to its surrounding lexical environment — not a copy. As long as that inner function stays reachable, the engine can't garbage-collect the variables it closes over, so they live on the heap instead of dying with the outer call's stack frame. Each call to the outer function builds a *fresh* environment, so closures returned from separate calls hold independent state.

## Code
Private state — the classic counter:
```js
function makeCounter() {
  let count = 0; // private; unreachable from outside
  return { inc: () => ++count, get: () => count };
}
const c = makeCounter();
c.inc();
c.inc();
console.log(c.get()); // 2 — count survived makeCounter returning
```

Independent instances — each call closes over its own `count`:
```js
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const a = makeCounter();
const b = makeCounter();
console.log(a(), a(), b()); // 1 2 1 — b has its own state
```

The loop-variable trap and its fix:
```js
// var is function-scoped: one shared i, read after the loop ends
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 0); // 3 3 3
}
// let creates a new binding each iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log("let:", i), 0); // 0 1 2
}
```

## Gotchas
- Closures capture **variables, not values** — the loop bug prints `3 3 3` because every callback shares the same `i` and reads it *after* the loop finished. `let` (or an IIFE capturing a copy) gives each iteration its own binding.
- Long-lived closures can leak memory: whatever they close over stays alive. A closure held by a global event listener keeps its entire captured scope from being collected until you remove the listener.
- Every closure from the same outer call shares one environment — `inc` and `get` above see the *same* `count`. That is the point, but it surprises people who expect per-method state.

## Follow-ups
- **"Is `count` truly private?"** Yes — nothing outside the returned functions references it, so it can't be read or mutated directly. ES2022 `#private` class fields are the class-based alternative.
- **"How do React hooks relate?"** `useState` returns a setter that closes over the current fiber's state slot; stale-closure bugs in `useEffect` are the loop trap in disguise.
- **"Does a closure copy the variables?"** No — it holds a live reference, which is why later mutations are visible across every call.

## Related
[[Hoisting-TDZ]] · [[Debounce-Throttle]] · [[Currying]] · [[This-Binding]]
