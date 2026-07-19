# JavaScript — Output-Based Questions

> "What does this print?" — predict + explain WHY. Covers hoisting, closures, `this`, event loop, coercion.

---

## 1. Event loop order
```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1, 4, 3, 2  -> sync, then microtask(Promise), then macrotask(setTimeout)
```
See [[Event-Loop]].

## 2. var in loop with setTimeout
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
// 3, 3, 3   (var = one shared binding, loop done before timers fire)

for (let i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
// 0, 1, 2   (let = new binding per iteration)
```
See [[Closures]].

## 3. Hoisting
```js
console.log(a); // undefined  (var hoisted, init undefined)
var a = 5;

console.log(b); // ReferenceError (let in TDZ)
let b = 5;

foo();          // "hi" (function declaration fully hoisted)
function foo() { console.log("hi"); }
```
See [[Hoisting-TDZ]].

## 4. this in different calls
```js
const obj = {
  name: "X",
  regular() { return this.name; },
  arrow: () => this.name,
};
obj.regular();          // "X"
obj.arrow();            // undefined (arrow: this = outer/module)
const f = obj.regular;
f();                    // undefined (lost implicit binding)
```
See [[This-Binding]].

## 5. Type coercion traps
```js
console.log(1 + "2");        // "12"  (number -> string)
console.log("5" - 2);        // 3     (string -> number)
console.log(1 + true);       // 2     (true -> 1)
console.log([] + []);        // ""    (both -> "")
console.log([] + {});        // "[object Object]"
console.log(0.1 + 0.2);      // 0.30000000000000004 (float)
console.log(0.1 + 0.2 === 0.3); // false
console.log(null == undefined);  // true
console.log(null === undefined); // false
console.log(NaN === NaN);        // false
```
See [[Type-Coercion-Equality]].

## 6. Closures counter
```js
function counter() {
  let c = 0;
  return () => ++c;
}
const inc = counter();
inc(); inc(); console.log(inc()); // 3
```

## 7. async/await ordering
```js
async function f() {
  console.log("A");
  await null;
  console.log("B");
}
console.log("start");
f();
console.log("end");
// start, A, end, B   (code after await = microtask)
```

## 8. setTimeout vs Promise vs nextTick (Node)
```js
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
// nextTick, promise, timeout
```
See [[Node-Event-Loop]].

## 9. Object key coercion
```js
const obj = {};
obj[1] = "a";
obj["1"] = "b";
console.log(obj[1]); // "b"  (keys coerced to strings)
```

## 10. Reference vs value
```js
let a = { x: 1 };
let b = a;
b.x = 99;
console.log(a.x); // 99 (same reference)

let p = 1, q = p; q = 99;
console.log(p);   // 1 (primitives copied by value)
```
See [[Deep-Shallow-Copy]].

## 11. Spread / mutation
```js
const arr = [1, 2, 3];
const copy = [...arr];
copy.push(4);
console.log(arr); // [1,2,3] (spread = shallow copy, top level safe)
```

## Related
[[Event-Loop]] · [[Closures]] · [[Hoisting-TDZ]] · [[This-Binding]] · [[Type-Coercion-Equality]]
