# JavaScript — ES6+ Modern Features

## Q
Key ES6+ features you use daily? Destructuring, spread/rest, optional chaining, Map/Set, Proxy.

## A
Modern JS syntax that makes code shorter + safer. Interviewers expect fluent use.

## Code
Destructuring:
```js
const { name, age = 18 } = user;        // default value
const { address: { city } } = user;     // nested
const [first, , third] = arr;           // skip
const { a, ...rest } = obj;             // rest of object
function fn({ id, name }) {}             // param destructuring
```

Spread / rest:
```js
const merged = { ...obj1, ...obj2 };     // shallow merge (later wins)
const combined = [...arr1, ...arr2];
const clone = [...arr];                  // shallow copy
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); } // rest
Math.max(...[1, 2, 3]);                  // spread as args
```

Optional chaining + nullish:
```js
user?.address?.city;                     // undefined if any null, no throw
user?.getName?.();                       // safe method call
arr?.[0];                                // safe index
const port = config.port ?? 3000;        // only null/undefined -> default
```

Template literals:
```js
`Hello ${name}, you have ${count} items`;
```

Map / Set / WeakMap:
```js
const map = new Map([["a", 1]]);         // any key type, ordered, .size
map.get("a"); map.set("b", 2); map.has("a");
const set = new Set([1, 1, 2]);          // unique -> {1,2}
[...new Set(arr)];                        // dedup
const wm = new WeakMap();                 // keys GC'd when unreferenced (no leak)
```

Object shorthand + computed keys:
```js
const key = "dynamic";
const obj = { name, age, [key]: 1, greet() {} };
```

Proxy (meta-programming):
```js
const target = { count: 0 };
const proxy = new Proxy(target, {
  get: (obj, prop) => (prop in obj ? obj[prop] : `no ${prop}`),
  set: (obj, prop, val) => { console.log(`set ${prop}=${val}`); obj[prop] = val; return true; },
});
proxy.count = 5;    // logs "set count=5"
proxy.missing;      // "no missing"
```
**Where Proxy:** Vue 3 reactivity, validation, logging, default values.

Array/Object helpers:
```js
Object.entries(obj); Object.keys(obj); Object.values(obj);
Object.fromEntries([["a", 1]]);          // {a:1}
arr.at(-1);                              // last element
arr.flatMap((x) => [x, x * 2]);
arr.findLast((x) => x > 2);
```

## Why / Where
- Destructuring + spread everywhere in React (props, state updates).
- `?.` / `??` kill null-check boilerplate + crashes.
- `Map`/`Set` for dedup, lookups, ordered keys.
- `WeakMap` for private data / caches without leaks.

## Related
[[Deep-Shallow-Copy]] · [[Iterators-Generators]] · [[Type-Coercion-Equality]]
