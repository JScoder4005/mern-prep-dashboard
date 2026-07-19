# Node Event Loop & Concurrency

## Q
How does Node handle concurrency on a single thread? Explain libuv phases. Worker threads vs cluster?

## A
Node is single-threaded for JS but uses **libuv** (C++ thread pool + OS async) for I/O. Non-blocking I/O + event loop = handles thousands of connections without threads per request. CPU-bound work still blocks → offload to worker threads / cluster.

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

## How
libuv thread pool (default 4) handles fs/dns/crypto. Network I/O uses OS async (epoll/kqueue). JS callbacks run on the single main thread when events ready.

## Why
Event-driven = high throughput for I/O-bound apps (typical web API). Blocking the loop (sync loop, JSON.parse huge) freezes all requests.

## Where / Scenario
- API server handling many concurrent DB/HTTP calls.
- Never do heavy sync compute on main thread — offload.
- Scale prod: cluster / PM2 across cores.

## Related
[[Event-Loop]] · [[Streams-Buffers]]
