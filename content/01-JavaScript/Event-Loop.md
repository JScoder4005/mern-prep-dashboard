# Event Loop

## Q
Explain the JavaScript event loop. Predict the output order of sync code, `setTimeout`, and `Promise`.

## A
JS is single-threaded. Synchronous code runs first on the call stack. Async callbacks wait in queues. Event loop moves them to the stack **only when the stack is empty**. **Microtasks (Promises) run before macrotasks (setTimeout)** after each sync flush.

## Code
```js
console.log("1 start");

setTimeout(() => console.log("2 setTimeout"), 0);   // macrotask

Promise.resolve().then(() => console.log("3 promise")); // microtask

console.log("4 end");

// Output:
// 1 start
// 4 end
// 3 promise      <-- microtask BEFORE macrotask
// 2 setTimeout
```

Harder one:
```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve()
  .then(() => console.log("C"))
  .then(() => console.log("D"));
console.log("E");

// A, E, C, D, B
// all microtasks drain fully before the timeout macrotask
```

## How
- **Call stack** — runs current function.
- **Microtask queue** — Promise `.then`, `queueMicrotask`, `MutationObserver`. Drained fully after each stack empty.
- **Macrotask queue** — `setTimeout`, `setInterval`, I/O, UI events. One per loop tick.
- Loop: run stack → drain ALL microtasks → run ONE macrotask → repeat.

## Why
Single thread avoids race conditions but must never block. Offloading async work to queues keeps UI responsive. Microtask priority lets Promise chains resolve before next render/timer.

## Where / Scenario
- Debug "why did my state update log after the network log."
- Explain why `await` inside loop serializes but `Promise.all` parallelizes.
- Node version differs (libuv phases) → see [[Node-Event-Loop]].

## Related
[[Async-Promises]] · [[Node-Event-Loop]]
