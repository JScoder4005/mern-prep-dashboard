# Node Event Loop & Concurrency

## Q
How does Node handle concurrency on a single thread? Explain libuv phases. Worker threads vs cluster?

## Answer
JS itself runs on a single thread, but Node offloads I/O to **libuv** — a C++ layer that uses the OS's async facilities (epoll/kqueue) for network I/O and a small thread pool for things like file/DNS/crypto that don't have an async OS primitive. The event loop just cycles through fixed phases, running whatever callbacks became ready, so one thread can juggle thousands of concurrent connections without a thread per request. The catch: that single JS thread is still one thread — a synchronous CPU-heavy computation blocks the loop and stalls every other request until it finishes, which is what worker threads and clustering exist to route around.

## Code
Non-blocking demo:
```js
const fs = require("fs");
console.log("1");
fs.readFile("big.txt", () => console.log("3 file done")); // async, offloaded
console.log("2");
// 1, 2, 3  -> readFile didn't block
```

Node loop phases (order per tick):
```
timers        -> setTimeout / setInterval callbacks
pending       -> deferred I/O callbacks
poll          -> retrieve new I/O events, run their callbacks
check         -> setImmediate callbacks
close         -> close events (socket.on('close'))
```
Between EACH phase: microtasks drain — `process.nextTick` (highest) then Promises.

```js
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
// nextTick, promise, timeout, immediate
```

CPU-bound → worker thread:
```js
const { Worker } = require("worker_threads");
new Worker("./heavy.js"); // runs on separate thread, no block main
```

## cluster vs worker_threads
| | use |
|---|---|
| `cluster` | fork multiple processes (1 per CPU core), scale HTTP across cores, shared port |
| `worker_threads` | offload CPU-heavy compute in same process, shared memory |

## How it works
The libuv thread pool (4 threads by default) handles the syscalls that don't have a native async OS interface — `fs`, DNS lookups, some crypto. True network I/O (sockets, HTTP) uses the OS's async event notification directly, no thread pool needed. Either way, the actual JS callback always runs back on the single main thread once its event is ready, and between every phase Node drains microtasks — `process.nextTick` first, then resolved Promises — before moving to the next phase, which is why `nextTick`/`Promise.then` consistently beat `setTimeout(0)`/`setImmediate`.

## Gotchas
- **A synchronous CPU-bound loop (huge `JSON.parse`, a tight `for` loop, sync crypto) blocks everyone**, not just the request that triggered it — there's only one JS thread to stall.
- **`process.nextTick` starves the event loop if called recursively** — it drains fully before the loop can proceed to I/O, so a `nextTick` that re-queues itself can freeze timers/I/O indefinitely.
- **The libuv pool size (default 4) becomes a bottleneck under fs/crypto-heavy load** — `UV_THREADPOOL_SIZE` can be raised, but that's a knob for a real production bottleneck, not something to tune preemptively.
- **`cluster` gives you separate processes (separate memory)**; `worker_threads` gives you threads that can share memory via `SharedArrayBuffer` — picking the wrong one means either unnecessary IPC overhead or unwanted shared mutable state.

## Follow-ups
- **"How do you handle a CPU-heavy endpoint (e.g. image resize) without blocking the API?"** Move it to a `Worker` thread or a separate queue/worker process (BullMQ + Redis), and have the endpoint return quickly with a job id.
- **"Why does `setImmediate` sometimes run before `setTimeout(fn, 0)` and sometimes after?"** Order depends on whether they're scheduled inside an I/O callback (poll phase) — there `setImmediate` reliably wins — versus the main module (order is not guaranteed there).
- **"How do you scale a Node API across CPU cores?"** `cluster` (or PM2 in cluster mode) forks one process per core, all sharing the same listening port via the OS — each core gets its own event loop and V8 heap.

## Related
[[Event-Loop]] · [[Streams-Buffers]]
