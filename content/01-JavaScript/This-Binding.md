# `this` Binding

## Q
How is `this` determined? Difference between `call`, `apply`, `bind`? Why arrow functions differ?

## A
`this` = the calling context, decided at **call time** (except arrow fns). Four rules, priority order:
1. `new` → new object.
2. Explicit `call`/`apply`/`bind` → given object.
3. Implicit (`obj.method()`) → `obj`.
4. Default → `undefined` (strict) / global (sloppy).
Arrow functions have **no own `this`** — they inherit from enclosing lexical scope.

## Code
```js
const user = {
  name: "Varun",
  regular() { return this.name; },
  arrow: () => this?.name,   // `this` = outer scope, NOT user
};
user.regular(); // "Varun"
user.arrow();   // undefined

// call / apply / bind
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const p = { name: "Tej" };
greet.call(p, "Hi", "!");        // pass args comma-separated
greet.apply(p, ["Hi", "!"]);     // pass args as ARRAY
const bound = greet.bind(p);     // returns NEW fn, call later
bound("Hey", ".");

// lost `this` bug
const fn = user.regular;
fn(); // undefined (implicit binding lost)
```

## How
- `call(ctx, ...args)` — invoke now, args listed.
- `apply(ctx, [args])` — invoke now, args array.
- `bind(ctx)` — returns new function permanently bound.

## Why
Reuse one function across many objects. `bind` fixes lost context in callbacks (pre-arrow era).

## Where / Scenario
- React class components: `this.handleClick = this.handleClick.bind(this)`.
- Arrow methods in classes to auto-bind event handlers.
- Borrowing methods: `Array.prototype.slice.call(arguments)`.

## Related
[[Prototype-Inheritance]] · [[Polyfills]]
