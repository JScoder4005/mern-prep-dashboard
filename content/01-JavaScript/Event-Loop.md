# Event Loop

## Q
Explain the JavaScript event loop, and predict the output order of synchronous code, `setTimeout`, and `Promise` callbacks.

## Answer
JavaScript runs on a single thread with one call stack. Synchronous code runs to completion first — async callbacks never interrupt it, they wait in queues, and the event loop only moves one onto the stack once the stack is empty. The key ordering rule: after each run of synchronous code the engine drains the **entire microtask queue** (Promise callbacks) before taking a **single macrotask** (like a `setTimeout`). So Promises always resolve before timers — even a `setTimeout(…, 0)`.

## How it works
- **Call stack** — the currently executing function and its callers.
- **Microtask queue** — `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`. Drained *fully* every time the stack empties, including microtasks scheduled by other microtasks.
- **Macrotask queue** — `setTimeout`, `setInterval`, I/O, UI events. Exactly **one** is taken per loop tick.
- The loop: run the stack → drain all microtasks → run one macrotask → repeat. That microtask-before-macrotask priority is what makes a `Promise.then` beat a `setTimeout(…, 0)`.

## Code
Sync vs microtask vs macrotask:
```js
console.log("1 sync start");
setTimeout(() => console.log("2 setTimeout (macrotask)"), 0);
Promise.resolve().then(() => console.log("3 promise (microtask)"));
console.log("4 sync end");
// 1 sync start
// 4 sync end
// 3 promise (microtask)   <- runs before the timer
// 2 setTimeout (macrotask)
```

A chained Promise drains fully before the timer fires:
```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve()
  .then(() => console.log("C"))
  .then(() => console.log("D"));
console.log("E");
// A, E, C, D, B — both .then microtasks finish before macrotask B
```

## Gotchas
- `setTimeout(fn, 0)` does **not** run immediately — it's a macrotask, so any pending Promise microtask jumps ahead of it.
- A runaway microtask chain (a `.then` that keeps scheduling another `.then`) can **starve** macrotasks — timers and rendering never get a turn.
- `await x` is sugar for `.then` — code after an `await` resumes as a *microtask*, not synchronously.
- Browser and Node differ: Node's loop has libuv phases and adds `process.nextTick` (higher priority than Promise microtasks) and `setImmediate`. See [[Node-Event-Loop]].

## Follow-ups
- **"Why does `await` in a loop serialize but `Promise.all` parallelize?"** `await` pauses the function until each promise settles; `Promise.all` starts them all first, then awaits the aggregate.
- **"Where does `process.nextTick` fit?"** Node drains the nextTick queue before the regular microtask queue — higher priority than Promises.
- **"Can async code cause a race on one thread?"** Not a data race, but interleaving-order bugs (e.g. state read between an `await` and its resume) absolutely happen.

## Related
[[Async-Promises]] · [[Node-Event-Loop]]
