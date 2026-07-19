# Closures

## Q
What is a closure? Give a real use case.

## A
A closure = a function that **remembers variables from the scope where it was created**, even after that outer function has returned. Enables private state.

## Code
Counter (private state):
```js
function makeCounter() {
  let count = 0;                 // private, not accessible outside
  return {
    inc: () => ++count,
    get: () => count,
  };
}
const c = makeCounter();
c.inc(); c.inc();
console.log(c.get()); // 2
// `count` survives because inner fns close over it
```

Classic loop bug + fix:
```js
// BUG: var is function-scoped -> all print 3
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3,3,3
}

// FIX 1: let (block-scoped, new binding each iter)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0,1,2
}

// FIX 2: IIFE closure captures copy
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 0))(i); // 0,1,2
}
```

## How
Inner function keeps a reference to its outer lexical environment. Variable lives on the heap, not garbage-collected while closure alive.

## Why
Data privacy (no real private vars pre-ES2022), state persistence, function factories, currying.

## Where / Scenario
- React hooks internally use closures (`useState` closes over state).
- Memoize cache: [[Polyfills]].
- Debounce/throttle store timer in closure: [[Debounce-Throttle]].
- Module pattern, event handlers holding config.

## Related
[[Hoisting-TDZ]] · [[Debounce-Throttle]] · [[Currying]]
