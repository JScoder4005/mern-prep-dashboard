# Hoisting & TDZ

## Q
What is hoisting? Difference between `var`, `let`, `const` regarding hoisting and TDZ?

## A
Hoisting = declarations moved to top of scope at compile time. `var` hoists and initializes to `undefined`. `let`/`const` hoist but stay in the **Temporal Dead Zone (TDZ)** — accessing before declaration throws `ReferenceError`. Function declarations hoist fully (callable before defined).

## Code
```js
console.log(a); // undefined  (var hoisted + init undefined)
var a = 1;

console.log(b); // ReferenceError (TDZ)
let b = 2;

foo();          // works - function declaration fully hoisted
function foo() { return "hi"; }

bar();          // TypeError: bar is not a function
var bar = () => {}; // only `var bar` hoisted (undefined), not the fn
```

Scope difference:
```js
if (true) {
  var x = 1;   // function/global scoped -> leaks
  let y = 2;   // block scoped
}
console.log(x); // 1
console.log(y); // ReferenceError
```

## How
Engine has two phases: **creation** (allocate declarations) then **execution** (assign values). `var` gets `undefined` in creation; `let`/`const` stay uninitialized (TDZ) until execution reaches the line.

## Why
`let`/`const` + TDZ catch bugs early (use-before-declare). Block scope prevents leak. Prefer `const` by default, `let` when reassigned, never `var`.

## Where / Scenario
- Explain loop closure bug root cause: [[Closures]].
- Interview trap: predict output of hoisting snippet.

## Related
[[Closures]] · [[Event-Loop]]
