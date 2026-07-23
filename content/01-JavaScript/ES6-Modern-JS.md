# JavaScript — ES6+ Modern Features

## Q
Which ES6+ features do you use daily, and what problem does each solve?

## Answer
The ones I lean on constantly: destructuring and spread/rest for pulling values out of and merging objects/arrays; optional chaining (`?.`) and nullish coalescing (`??`) to kill null-check boilerplate without swallowing valid falsy values; `Map`/`Set` for keyed lookups and dedup; template literals for readable strings; and `Object.entries/fromEntries` for transforming objects. They make code shorter *and* safer — interviewers expect fluent, idiomatic use, not just recognition.

## How it works
- **Destructuring** binds properties/elements by pattern; defaults fill in for `undefined` (not `null`), and you can rename and go nested in one statement.
- **Spread** does a *shallow* copy/merge — later keys win, nested objects are still shared by reference. **Rest** collects "everything else" into an array or object.
- **`?.`** short-circuits to `undefined` the moment any link is nullish, so no `TypeError`. **`??`** falls back only on `null`/`undefined`, unlike `||`, which also triggers on `0`, `""`, and `false`.
- **`Map`** allows any key type, preserves insertion order, and exposes `.size`; **`Set`** stores unique values — ideal for dedup.

## Code
Destructuring — rename, default, nested, swap:
```js
const user = { id: 1, name: "Ada", address: { city: "London" } };
const { name, role = "guest" } = user; // default fills missing key
const { address: { city } } = user;    // nested
let a = 1, b = 2;
[a, b] = [b, a];                        // swap, no temp
console.log(name, role, city, a, b);    // Ada guest London 2 1
```

Spread / rest — shallow merge, collect the rest:
```js
const base = { theme: "dark", zoom: 1 };
const merged = { ...base, zoom: 2 };     // later wins
const { theme, ...rest } = merged;       // rest = { zoom: 2 }
const sum = (...nums) => nums.reduce((t, n) => t + n, 0);
console.log(merged, rest, sum(1, 2, 3)); // {theme:'dark',zoom:2} {zoom:2} 6
```

Optional chaining vs nullish — and the `||` trap:
```js
const config = { port: 0, db: { host: "localhost" } };
console.log(config?.db?.host);   // localhost
console.log(config?.cache?.ttl); // undefined (no throw)
console.log(config.port ?? 3000); // 0  — kept, ?? only replaces null/undefined
console.log(config.port || 3000); // 3000 — bug: 0 is falsy
```

Map / Set — lookup + dedup:
```js
const seen = new Map([["a", 1]]);
seen.set("b", 2);
const nums = [1, 1, 2, 3, 3];
console.log(seen.get("a"), seen.size, [...new Set(nums)]); // 1 2 [1,2,3]
```

Object helpers, template literals, computed keys:
```js
const prices = { pen: 2, book: 5 };
const doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2]),
);
const key = "score";
const player = { name: "Ada", [key]: 42 };        // computed property name
console.log(doubled, `${player.name}:${player[key]}`); // {pen:4,book:10} Ada:42
```

## Gotchas
- `??` vs `||`: use `??` for defaults when `0`, `""`, or `false` are valid values — `||` silently replaces them.
- Spread is **shallow**: `{ ...obj }` copies the top level only; nested objects/arrays stay shared. Deep clone needs `structuredClone` or manual recursion — see [[Deep-Shallow-Copy]].
- Destructuring defaults apply only to `undefined`, **not** `null`: `const { x = 5 } = { x: null }` yields `null`.
- Destructuring a `null`/`undefined` value throws; guard with `const { x } = obj ?? {}`.

## Follow-ups
- **"`?.` vs `&&` chaining?"** `?.` is purpose-built and reads cleaner, and it also guards method calls (`obj.fn?.()`) and indexes (`arr?.[0]`).
- **"When would `Map` beat a plain object?"** Non-string keys, guaranteed insertion order, frequent add/delete, or needing `.size` in O(1).
- **"Any meta-programming feature you'd mention?"** `Proxy` + `Reflect` wrap an object to intercept `get`/`set` — it's how Vue 3 reactivity works. `WeakMap` gives leak-free private caches (keys GC'd when unreferenced).

## Related
[[Deep-Shallow-Copy]] · [[Iterators-Generators]] · [[Type-Coercion-Equality]]
