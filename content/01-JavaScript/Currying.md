# Currying

## Q
What is currying? Implement `sum(1)(2)(3)` and a generic `curry`.

## Answer
Currying transforms a function that takes N arguments into a chain of N functions that each take one argument, returning the next function until all arguments are collected. It's built entirely on closures — each returned function remembers the arguments gathered so far. In practice it powers partial application: you pre-fill some arguments once and reuse the specialized function, which is the backbone of point-free functional style and libraries like Ramda and lodash/fp.

## How it works
Each call returns a new closure that captures the arguments seen so far. A *generic* curry uses `fn.length` — the declared arity — to decide whether it has enough arguments to invoke the original function, or should return another collector. Because closures capture live bindings, the accumulated arguments survive across the chained calls.

## Code
Fixed arity — nested closures:
```js
function sum(a) {
  return (b) => (c) => a + b + c;
}
const curried = (a) => (b) => (c) => a + b + c; // arrow shorthand
console.log(sum(1)(2)(3), curried(1)(2)(3)); // 6 6
```

Generic curry — flexible grouping of arguments:
```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args); // enough -> run
    return (...next) => curried.apply(this, [...args, ...next]); // gather more
  };
}
const add = (a, b, c) => a + b + c;
const cadd = curry(add);
console.log(cadd(1)(2)(3), cadd(1, 2)(3), cadd(1)(2, 3)); // 6 6 6
```

Infinite currying — terminate with an empty call:
```js
function infSum(a) {
  return (b) => (b === undefined ? a : infSum(a + b));
}
console.log(infSum(1)(2)(3)()); // 6 — the final () with no arg returns the total
```

## Gotchas
- Generic `curry` relies on `fn.length`, which **ignores** rest params and defaulted params — `(a, b = 1) => …` reports length 1, so auto-curry can under-count.
- Currying (one arg at a time) is not the same as *partial application* (fix some args, call with the rest) — interviewers sometimes conflate them.
- Each intermediate call allocates a closure; in a hot path that overhead can matter.

## Follow-ups
- **"Real use case?"** Pre-configuring a function: `const logInfo = curry(log)("INFO")`, then `logInfo("saved")`.
- **"How does the infinite version know to stop?"** It checks whether the next argument is `undefined` — calling it with no argument returns the accumulated sum.
- **"curry vs partial?"** `curry` returns unary steps; partial (`fn.bind(null, a)`) fixes some args and takes the rest in one later call.

## Related
[[Closures]] · [[This-Binding]]
