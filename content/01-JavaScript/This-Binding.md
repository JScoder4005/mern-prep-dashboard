# `this` Binding

## Q
How is `this` determined? What's the difference between `call`, `apply`, and `bind`? Why do arrow functions differ?

## Answer
`this` is the calling context, decided at **call time** — not where the function was written (arrow functions are the exception). Four rules in priority order: `new` binds `this` to the fresh object; an explicit `call`/`apply`/`bind` binds it to the object you pass; an implicit `obj.method()` call binds it to the object before the dot; otherwise it defaults to `undefined` in strict mode (the global object in sloppy mode). Arrow functions have **no own `this`** — they capture it lexically from the scope where they were defined, which is why they're handy for callbacks but wrong as object methods.

## How it works
- `call(ctx, ...args)` — invoke now, arguments listed one by one.
- `apply(ctx, [args])` — invoke now, arguments passed as an array.
- `bind(ctx, ...args)` — returns a **new** function permanently bound to `ctx` (and optionally pre-filled args), to call later.

## Code
Implicit binding vs arrow:
```js
const user = {
  name: "Varun",
  regular() { return this.name; }, // `this` = the object before the dot
  arrow: () => this,               // inherits `this` from definition scope, not user
};
console.log(user.regular());        // Varun
console.log(user.arrow() === user); // false — the arrow ignored the object
```

call / apply / bind:
```js
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const p = { name: "Tej" };
console.log(greet.call(p, "Hi", "!"));    // Hi, Tej!  — args comma-separated
console.log(greet.apply(p, ["Hey", "."])); // Hey, Tej. — args as an array
const bound = greet.bind(p);               // new fn permanently bound to p
console.log(bound("Yo", "?"));             // Yo, Tej?
```

The lost-`this` bug:
```js
const obj = { name: "Ada", hi() { return this?.name ?? "lost"; } };
const detached = obj.hi;   // pulled off the object
console.log(obj.hi());     // Ada  — called with a receiver
console.log(detached());   // lost — implicit binding gone, this is undefined
```

## Gotchas
- Passing a method as a callback (`setTimeout(obj.hi)`, `onClick={obj.hi}`) drops the implicit binding — `this` becomes `undefined`. Fix with `bind`, an arrow wrapper, or a class field arrow method.
- Arrow functions can't be rebound — `call/apply/bind` have no effect on their `this`.
- Never use an arrow as an object method or prototype method that needs `this` to be the instance.
- `new` with an arrow throws — arrows aren't constructors.

## Follow-ups
- **"How did we auto-bind before arrows?"** React class components did `this.handleClick = this.handleClick.bind(this)` in the constructor.
- **"What is method borrowing?"** Calling another type's method with a chosen `this`, e.g. `Array.prototype.slice.call(arguments)` to turn `arguments` into an array.
- **"Does `bind` copy the function?"** It returns a new bound function; binding an already-bound function can't change its `this` again.

## Related
[[Prototype-Inheritance]] · [[Polyfills]] · [[Closures]]
