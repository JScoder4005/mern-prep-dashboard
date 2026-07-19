# Currying

## Q
What is currying? Implement `sum(1)(2)(3)` and a generic curry.

## A
Currying = transform a function of N args into N chained functions of 1 arg each. Built on **closures**.

## Code
Fixed arity:
```js
function sum(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
sum(1)(2)(3); // 6

// arrow shorthand
const sum2 = (a) => (b) => (c) => a + b + c;
```

Generic curry (works for any function):
```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {       // enough args -> run
      return fn.apply(this, args);
    }
    return (...next) => curried.apply(this, [...args, ...next]); // gather more
  };
}
const add = (a, b, c) => a + b + c;
const cadd = curry(add);
cadd(1)(2)(3);   // 6
cadd(1, 2)(3);   // 6
cadd(1)(2, 3);   // 6  -> flexible
```

Infinite sum `sum(1)(2)(3)...()`:
```js
function infSum(a) {
  const fn = (b) => (b === undefined ? a : infSum(a + b));
  return fn;
}
infSum(1)(2)(3)(); // 6
```

## How
Each call returns a new closure capturing prior args until enough collected (`fn.length` = expected arg count).

## Why
Partial application, reusable configured functions, point-free functional style.

## Where / Scenario
- Configure once, reuse: `const log = curry(logger)("INFO")`.
- Functional libs (Ramda, lodash/fp).
- Middleware composition.

## Related
[[Closures]] · [[This-Binding]]
