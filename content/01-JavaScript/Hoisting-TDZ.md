# Hoisting & TDZ

## Q
What is hoisting? How do `var`, `let`, and `const` differ regarding hoisting and the TDZ?

## Answer
Hoisting is the engine allocating declarations at the top of their scope during a compile pass, before any code runs. `var` is hoisted **and** initialized to `undefined`, so reading it before its line gives `undefined`. `let` and `const` are also hoisted but stay **uninitialized in the Temporal Dead Zone (TDZ)** — reading them before their declaration throws a `ReferenceError`. Function *declarations* are hoisted fully, so you can call them before they appear; a function assigned to a `var` is not — only the `var` binding hoists as `undefined`.

## How it works
The engine runs in two phases per scope. In the **creation** phase it registers declarations: `var` bindings get `undefined`, function declarations get their full function, and `let`/`const` are registered but left uninitialized (the TDZ). In the **execution** phase it runs top-to-bottom, and a `let`/`const` only leaves the TDZ when execution reaches its declaration line. `var` is function/global scoped (it leaks out of blocks); `let`/`const` are block scoped.

## Code
`var` is `undefined`, `let`/`const` throw in the TDZ:
```js
console.log(a); // undefined — var hoisted and initialized to undefined
var a = 1;
try {
  console.log(b); // reading b before its line...
} catch (e) {
  console.log(e.constructor.name); // ReferenceError — b is in the TDZ
}
let b = 2;
console.log(b); // 2 — fine after its declaration
```

Function declaration vs var-assigned function:
```js
console.log(foo()); // "hi" — function declaration is fully hoisted
function foo() { return "hi"; }
try {
  bar(); // bar is hoisted as undefined, not yet a function...
} catch (e) {
  console.log(e.constructor.name); // TypeError
}
var bar = () => "late";
console.log(bar()); // "late" — after the assignment runs
```

Block scope vs leaking `var`:
```js
if (true) {
  var x = 1; // function/global scoped -> leaks out of the block
  let y = 2; // block scoped
}
console.log(x); // 1 — var leaked
try {
  console.log(y); // y is not visible here...
} catch (e) {
  console.log(e.constructor.name); // ReferenceError
}
```

## Gotchas
- Calling a `var`-assigned function before its line throws `TypeError` (`bar is not a function`), not `ReferenceError` — the binding exists but holds `undefined`.
- The `let`/`const` loop-closure fix works *because* each iteration gets a fresh block-scoped binding — the root cause of the `var` loop bug is scope, not timing. See [[Closures]].
- `typeof x` still throws inside the TDZ for a `let`/`const` `x` — `typeof` is only "safe" for never-declared identifiers.

## Follow-ups
- **"Are `let`/`const` hoisted at all?"** Yes — the binding is created at the top of the block, it's just uninitialized until its line, which is what the TDZ is.
- **"Why prefer `const`?"** It signals no reassignment and catches use-before-declare bugs; use `let` only when you must reassign, and avoid `var`.
- **"Predict the output"** of a mixed `var`/`let`/function snippet — interviewers love this; walk the creation phase first, then execution.

## Related
[[Closures]] · [[Event-Loop]]
