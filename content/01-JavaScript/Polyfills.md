# Polyfills & Implement-From-Scratch

## Q
Implement `map`, `filter`, `reduce`, `bind`, `Promise.all`, and `memoize` from scratch.

## Answer
A polyfill re-implements a built-in — usually on the prototype — so this round tests whether you actually understand the machinery behind the methods you use daily: how `this` resolves, how callbacks receive `(value, index, array)`, how prototypes make a method available on every array, and how promise ordering works. The array methods are a loop that invokes the callback; `bind` and `memoize` are closures that capture context/cache; `Promise.all` is a counter that resolves once every input settles and rejects on the first failure.

## How it works
Array polyfills live on `Array.prototype`, so inside them `this` is the array the method was called on — you iterate it and call the callback with `(this[i], i, this)`. `bind` returns a new function that closes over the target `this` and any preset args, then `apply`s them later. `Promise.all` wraps everything in a new promise, tracks a completion count, writes each result at its original index (to preserve order), and rejects as soon as any input rejects.

## Code
`Array.prototype.map`:
```js
Array.prototype.myMap = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) out.push(cb(this[i], i, this));
  return out;
};
console.log([1, 2, 3].myMap((x) => x * 2)); // [2,4,6]
```

`filter`:
```js
Array.prototype.myFilter = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) if (cb(this[i], i, this)) out.push(this[i]);
  return out;
};
console.log([1, 2, 3, 4].myFilter((x) => x % 2 === 0)); // [2,4]
```

`reduce` — note the "no seed" case uses the first element:
```js
Array.prototype.myReduce = function (cb, init) {
  let acc = init, start = 0;
  if (arguments.length < 2) { acc = this[0]; start = 1; } // no seed -> use first element
  for (let i = start; i < this.length; i++) acc = cb(acc, this[i], i, this);
  return acc;
};
console.log([1, 2, 3].myReduce((a, b) => a + b, 0)); // 6
```

`bind` — closure over context + preset args:
```js
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return function (...later) { return fn.apply(ctx, [...preset, ...later]); };
};
function greet(g, punct) { return `${g}, ${this.name}${punct}`; }
const bound = greet.myBind({ name: "Tej" }, "Hi");
console.log(bound("!")); // Hi, Tej!
```

`Promise.all` — order-preserving, fast-fail:
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((val) => {
        results[i] = val;                          // keep original order
        if (++done === promises.length) resolve(results);
      }, reject);                                  // reject on first failure
    });
  });
}
promiseAll([1, Promise.resolve(2), 3]).then((r) => console.log(r)); // [1,2,3]
```

`memoize` — cache keyed on the arguments:
```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
let calls = 0;
const square = memoize((n) => { calls++; return n * n; });
console.log(square(4), square(4), "calls:", calls); // 16 16 calls: 1
```

## Gotchas
- Checking `init === undefined` for reduce's seed is buggy when the caller *explicitly* passes `undefined` — use `arguments.length < 2` instead (done above).
- `JSON.stringify`-based memo keys break on functions, `undefined`, key order differences, and circular args — fine for primitives, risky for rich objects.
- Mutating `Array.prototype` pollutes every array globally — acceptable for a controlled polyfill, but a real one should use `Object.defineProperty` (non-enumerable) so it doesn't show up in `for...in`.
- A faithful `Promise.all` must wrap inputs in `Promise.resolve` so plain values (non-promises) work too.

## Follow-ups
- **"Why write results at index `i`?"** Promises settle out of order; indexing keeps the output aligned with the input.
- **"How would you cap memo cache size?"** Wrap the `Map` in an LRU eviction — see [[JS-Utility-Implementations]].
- **"Real `bind` extras?"** The spec version also supports being used as a constructor with `new`; interviewers rarely require that.

## Related
[[Prototype-Inheritance]] · [[This-Binding]] · [[Async-Promises]] · [[JS-Utility-Implementations]]
