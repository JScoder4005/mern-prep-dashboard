# JavaScript — Utility Implementations (from scratch)

> Machine-coding round: implement these. Tests closures, recursion, async, data structures.

---

## EventEmitter (pub/sub)
```js
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, cb) {
    (this.events[event] ||= []).push(cb);
    return () => this.off(event, cb);      // unsubscribe
  }
  off(event, cb) {
    this.events[event] = (this.events[event] || []).filter((f) => f !== cb);
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach((cb) => cb(...args));
  }
  once(event, cb) {
    const wrap = (...a) => { cb(...a); this.off(event, wrap); };
    this.on(event, wrap);
  }
}
```
**Where:** Node's core pattern, decoupled modules, custom hooks.

---

## LRU Cache — O(1) get/put
```js
class LRUCache {
  constructor(capacity) { this.cap = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key); this.map.set(key, val); // move to most-recent
    return val;
  }
  put(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.cap) this.map.delete(this.map.keys().next().value); // evict oldest
    this.map.set(key, val);
  }
}
```
**Why Map:** preserves insertion order → first key = least recently used. **Where:** caching, memoization with bounds.

---

## deepEqual
```js
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null)
    return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}
```

---

## groupBy
```js
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}
groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even"));
// { odd: [1,3], even: [2,4] }
```

---

## chunk array
```js
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
chunk([1, 2, 3, 4, 5], 2); // [[1,2],[3,4],[5]]
```

---

## retry with exponential backoff
```js
async function retry(fn, retries = 3, delay = 500) {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise((r) => setTimeout(r, delay));
    return retry(fn, retries - 1, delay * 2); // backoff doubles
  }
}
```
**Where:** flaky network calls, rate-limited APIs.

---

## promisify (callback -> promise)
```js
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, data) => (err ? reject(err) : resolve(data)));
    });
}
const readFileP = promisify(fs.readFile);
```

---

## pipe / compose
```js
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);    // left->right
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x); // right->left
const add1 = (n) => n + 1, double = (n) => n * 2;
pipe(add1, double)(5);    // (5+1)*2 = 12
compose(add1, double)(5); // (5*2)+1 = 11
```

---

## once (run only first time)
```js
function once(fn) {
  let called = false, result;
  return function (...args) {
    if (!called) { called = true; result = fn.apply(this, args); }
    return result;
  };
}
```

---

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
flattenObj({ a: { b: { c: 1 } }, d: 2 }); // { "a.b.c": 1, d: 2 }
```

---

## Run async in series vs parallel
```js
// series (one after another)
async function series(tasks) {
  const out = [];
  for (const task of tasks) out.push(await task());
  return out;
}
// parallel
const parallel = (tasks) => Promise.all(tasks.map((t) => t()));
```

## Related
[[Polyfills]] · [[Closures]] · [[Async-Promises]] · [[Currying]]
