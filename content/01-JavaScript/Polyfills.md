# Polyfills & Implement-From-Scratch

## Q
Implement `map`, `filter`, `reduce`, `bind`, `Promise.all`, and memoize from scratch.

## A
Polyfill = re-implement a built-in on the prototype. Tests understanding of `this`, callbacks, prototypes.

## Code
`Array.prototype.map`:
```js
Array.prototype.myMap = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    out.push(cb(this[i], i, this));
  }
  return out;
};
[1, 2, 3].myMap((x) => x * 2); // [2,4,6]
```

`filter`:
```js
Array.prototype.myFilter = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    if (cb(this[i], i, this)) out.push(this[i]);
  }
  return out;
};
```

`reduce`:
```js
Array.prototype.myReduce = function (cb, init) {
  let acc = init;
  let start = 0;
  if (acc === undefined) { acc = this[0]; start = 1; } // no seed -> use first
  for (let i = start; i < this.length; i++) {
    acc = cb(acc, this[i], i, this);
  }
  return acc;
};
[1, 2, 3].myReduce((a, b) => a + b, 0); // 6
```

`bind`:
```js
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return function (...later) {
    return fn.apply(ctx, [...preset, ...later]);
  };
};
```

`Promise.all`:
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          results[i] = val;          // keep order
          if (++done === promises.length) resolve(results);
        })
        .catch(reject);              // fast-fail
    });
  });
}
```

Memoize:
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
```

## How
Loop the array, invoke callback with `(value, index, array)`. `this` = the array/function the method is called on — see [[Prototype-Inheritance]].

## Why
Shows deep grasp of prototypes, closures, `this`, async ordering — favorite senior filter.

## Where / Scenario
- Memoize expensive pure computations (fib, API-derived data).
- `bind` polyfill = classic. `Promise.all` = classic.

## Related
[[Prototype-Inheritance]] · [[This-Binding]] · [[Async-Promises]]
