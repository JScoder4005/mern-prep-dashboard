# JavaScript — Utility Implementations (from scratch)

## Q
The machine-coding round: implement common utilities from scratch (EventEmitter, LRU cache, deepEqual, groupBy, chunk, retry, promisify, pipe/compose, once, flatten, series/parallel).

## Answer
These tests check that you can build reusable primitives, not just call libraries. The recurring tools are closures (private state in `once`, `memoize`, `EventEmitter`), recursion (`deepEqual`, `flattenObj`, `retry`), the `Map` (insertion order powers the O(1) LRU), and promise composition (`retry`, `promisify`, series vs parallel). Each one below is self-contained and logs its result so you can run it and confirm the behavior.

## How it works
The unifying ideas: a closure keeps state alive between calls; a `Map` gives ordered O(1) lookups (so the oldest key is `map.keys().next().value`); `reduce` builds up an accumulator (`groupBy`); recursion handles nested/unknown-depth data (`deepEqual`, `flattenObj`); and awaiting in a loop serializes work while `Promise.all` parallelizes it.

## EventEmitter (pub/sub)
```js
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, cb) { (this.events[event] ||= []).push(cb); return () => this.off(event, cb); }
  off(event, cb) { this.events[event] = (this.events[event] || []).filter((f) => f !== cb); }
  emit(event, ...args) { (this.events[event] || []).forEach((cb) => cb(...args)); }
  once(event, cb) { const wrap = (...a) => { cb(...a); this.off(event, wrap); }; this.on(event, wrap); }
}
const bus = new EventEmitter();
bus.on("msg", (x) => console.log("got:", x));
bus.emit("msg", "hello"); // got: hello
```
`on` returns an unsubscribe function — a common ergonomic touch. Node's core pattern.

## LRU Cache — O(1) get/put
```js
class LRUCache {
  constructor(capacity) { this.cap = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key); this.map.set(key, val); // move to most-recently-used
    return val;
  }
  put(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.cap) this.map.delete(this.map.keys().next().value); // evict LRU
    this.map.set(key, val);
  }
}
const lru = new LRUCache(2);
lru.put("a", 1);
lru.put("b", 2);
lru.get("a");    // touch "a" -> "b" becomes the oldest
lru.put("c", 3); // evicts "b"
console.log(lru.get("a"), lru.get("b"), lru.get("c")); // 1 -1 3
```
A `Map` preserves insertion order, so the first key is the least-recently-used.

## deepEqual
```js
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}
console.log(deepEqual({ x: { y: 1 } }, { x: { y: 1 } }), deepEqual([1], [2])); // true false
```

## groupBy
```js
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => { (acc[keyFn(item)] ||= []).push(item); return acc; }, {});
}
console.log(groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even"))); // {odd:[1,3],even:[2,4]}
```

## chunk array
```js
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1,2],[3,4],[5]]
```

## retry with exponential backoff
```js
async function retry(fn, retries = 3, delay = 5) {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise((r) => setTimeout(r, delay));
    return retry(fn, retries - 1, delay * 2); // backoff doubles each attempt
  }
}
let n = 0;
const flaky = () => (++n < 3 ? Promise.reject("nope") : Promise.resolve("ok"));
retry(flaky, 5).then((r) => console.log(r, "after", n, "tries")); // ok after 3 tries
```

## promisify (callback -> promise)
```js
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) =>
      fn(...args, (err, data) => (err ? reject(err) : resolve(data))));
}
const addCb = (a, b, cb) => cb(null, a + b); // node-style (err, data) callback
const addP = promisify(addCb);
addP(2, 3).then((sum) => console.log("sum:", sum)); // sum: 5
```

## pipe / compose
```js
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);        // left -> right
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x); // right -> left
const add1 = (n) => n + 1, double = (n) => n * 2;
console.log(pipe(add1, double)(5), compose(add1, double)(5)); // 12 11
```

## once (run only the first time)
```js
function once(fn) {
  let called = false, result;
  return function (...args) {
    if (!called) { called = true; result = fn.apply(this, args); }
    return result;
  };
}
let runs = 0;
const init = once(() => ++runs);
console.log(init(), init(), "runs:", runs); // 1 1 runs: 1
```

## flatten object (dot keys)
```js
function flattenObj(obj, prefix = "", res = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flattenObj(v, key, res);
    else res[key] = v;
  }
  return res;
}
console.log(flattenObj({ a: { b: { c: 1 } }, d: 2 })); // {"a.b.c":1,"d":2}
```

## async in series vs parallel
```js
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
async function series(tasks) {
  const out = [];
  for (const task of tasks) out.push(await task()); // one after another
  return out;
}
const parallel = (tasks) => Promise.all(tasks.map((t) => t())); // all at once
series([() => wait(5, "a"), () => wait(5, "b")]).then((r) => console.log("series:", r));
parallel([() => wait(5, "x"), () => wait(5, "y")]).then((r) => console.log("parallel:", r));
// series: ["a","b"]
// parallel: ["x","y"]
```

## Gotchas
- LRU: forgetting to `delete` before `set` on a `get`/existing `put` leaves the key in its old order slot, so eviction picks the wrong victim.
- `once` must cache and return the first result on later calls, not just skip execution.
- `retry` doubles the delay each attempt — cap it (and add jitter) in production so backoff doesn't explode.
- `flattenObj` treats arrays as leaves here; decide explicitly whether arrays should be flattened too.

## Follow-ups
- **"How does the LRU stay O(1)?"** `Map` gives O(1) get/set/delete and ordered keys, so eviction is O(1) too — no manual linked list needed.
- **"pipe vs compose?"** Same composition, opposite direction — `pipe` reads left-to-right, `compose` right-to-left.
- **"Make retry cancellable?"** Thread an `AbortSignal` through and reject early when it aborts.

## Related
[[Polyfills]] · [[Closures]] · [[Async-Promises]] · [[Currying]]
