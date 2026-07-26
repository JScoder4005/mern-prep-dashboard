# JavaScript — Output-Based Questions

## Q
"What does this print?" — predict the output and, more importantly, explain *why*. These snippets cover hoisting, closures, `this`, the event loop, and coercion.

## Answer
Work them in this order every time: first the **creation phase** (what's hoisted — `var` as `undefined`, functions fully, `let`/`const` into the TDZ), then **execution** top-to-bottom running all synchronous code, then the **event loop** (drain every microtask/Promise, then one macrotask/`setTimeout`). Layer coercion rules on top for the `+`/`==` traps. Each snippet below is runnable — the comment is the predicted output, so you can check yourself.

## 1. Event-loop order
```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1, 4, 3, 2 — sync first, then microtask (Promise), then macrotask (setTimeout)
```
See [[Event-Loop]].

## 2. `var` vs `let` in a loop with `setTimeout`
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log("var", i), 0);
// var 3, var 3, var 3 — one shared binding, loop finished before timers fire
for (let i = 0; i < 3; i++) setTimeout(() => console.log("let", i), 0);
// let 0, let 1, let 2 — a fresh binding per iteration
```
See [[Closures]].

## 3. Hoisting
```js
console.log(a); // undefined — var hoisted, initialized to undefined
var a = 5;
try {
  console.log(b); // b is in the Temporal Dead Zone...
} catch (e) {
  console.log(e.constructor.name); // ReferenceError
}
let b = 5;
foo(); // "hi" — function declaration is fully hoisted
function foo() { console.log("hi"); }
```
See [[Hoisting-TDZ]].

## 4. `this` in different calls
```js
const obj = {
  name: "X",
  regular() { return this?.name; },
  arrow: () => this?.name, // arrow: this = defining scope, not obj
};
console.log(obj.regular()); // "X"
console.log(obj.arrow());   // undefined — arrow ignored obj
const f = obj.regular;
console.log(f());           // undefined — implicit binding lost
```
See [[This-Binding]].

## 5. Coercion traps
```js
console.log(1 + "2");           // "12"  — number -> string
console.log("5" - 2);           // 3     — string -> number
console.log(1 + true);          // 2     — true -> 1
console.log([] + []);           // ""    — both stringify to ""
console.log([] + {});           // "[object Object]"
console.log(0.1 + 0.2);         // 0.30000000000000004 — IEEE-754
console.log(0.1 + 0.2 === 0.3); // false
console.log(null == undefined, null === undefined, NaN === NaN); // true false false
```
See [[Type-Coercion-Equality]].

## 6. Closure counter
```js
function counter() {
  let c = 0;
  return () => ++c;
}
const inc = counter();
inc();
inc();
console.log(inc()); // 3 — the closure keeps c alive across calls
```

## 7. async/await ordering
```js
async function f() {
  console.log("A");
  await null;          // everything after await is a microtask
  console.log("B");
}
console.log("start");
f();
console.log("end");
// start, A, end, B
```

## 8. setTimeout vs Promise vs nextTick
```js
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
if (typeof process !== "undefined" && process.nextTick)
  process.nextTick(() => console.log("nextTick"));
// Node:    nextTick, promise, timeout
// Browser: promise, timeout   (no process.nextTick)
```
See [[Node-Event-Loop]].

## 9. Object key coercion
```js
const obj = {};
obj[1] = "a";
obj["1"] = "b"; // same key — object keys are coerced to strings
console.log(obj[1]); // "b"
```

## 10. Reference vs value
```js
let a = { x: 1 };
let b = a;
b.x = 99;
console.log(a.x); // 99 — objects are shared by reference
let p = 1, q = p;
q = 99;
console.log(p); // 1 — primitives are copied by value
```
See [[Deep-Shallow-Copy]].

## 11. Spread is a shallow copy
```js
const arr = [1, 2, 3];
const copy = [...arr];
copy.push(4);
console.log(arr); // [1,2,3] — top-level copy, original untouched
```

## Related
[[Event-Loop]] · [[Closures]] · [[Hoisting-TDZ]] · [[This-Binding]] · [[Type-Coercion-Equality]]
