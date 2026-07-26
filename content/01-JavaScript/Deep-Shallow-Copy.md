# Deep vs Shallow Copy

## Q
What's the difference between a shallow and a deep copy? How do you deep-clone an object?

## Answer
A **shallow** copy duplicates only the top level — nested objects and arrays are still shared by reference, so mutating a nested value shows up in both copies. A **deep** copy recursively duplicates everything, producing a fully independent clone. The modern built-in is `structuredClone`, which handles `Date`, `Map`, `Set`, typed arrays, and circular references. The old `JSON.parse(JSON.stringify(x))` trick works only for plain JSON-safe data and silently drops functions/`undefined`, stringifies `Date`s, and throws on cycles.

## How it works
Spread (`{ ...obj }`) and `Object.assign` copy enumerable own properties one level deep. A correct deep clone must recurse into nested objects/arrays and track already-visited references (a `WeakMap`) so a circular structure doesn't cause infinite recursion. `structuredClone` implements the structured-clone algorithm and does all of this for you.

## Code
Shallow — nested state is shared:
```js
const a = { x: 1, nested: { y: 2 } };
const shallow = { ...a }; // or Object.assign({}, a)
shallow.nested.y = 99;
console.log(a.nested.y);  // 99 — the nested object is shared
```

Deep — `structuredClone`:
```js
const a = { x: 1, nested: { y: 2 } };
const deep = structuredClone(a);
deep.nested.y = 99;
console.log(a.nested.y);  // 2 — fully independent
```

The JSON trick and what it loses:
```js
const a = { n: 1, when: new Date("2020-01-01"), fn: () => 1, u: undefined };
const clone = JSON.parse(JSON.stringify(a));
console.log(typeof clone.when, "fn" in clone, "u" in clone);
// string false false — Date stringified, function + undefined dropped
```

Manual recursion, cycle-safe:
```js
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj; // primitive
  if (seen.has(obj)) return seen.get(obj);                 // already cloned (cycle)
  const copy = Array.isArray(obj) ? [] : {};
  seen.set(obj, copy);
  for (const key of Object.keys(obj)) copy[key] = deepClone(obj[key], seen);
  return copy;
}
const src = { a: 1, list: [{ n: 2 }] };
const out = deepClone(src);
out.list[0].n = 99;
console.log(src.list[0].n, out.list[0].n); // 2 99 — independent
```

## Gotchas
- `{ ...obj }` feels like a clone but only the top level is copied — a classic source of "why did my other object change?" bugs, especially with React state.
- `JSON.parse(JSON.stringify(x))` throws on circular references and quietly corrupts `Date`/`Map`/`Set`/`undefined`/functions — never use it for rich data.
- `structuredClone` can't clone functions or DOM nodes (it throws) — it's for data, not behavior.

## Follow-ups
- **"Why does immutability matter in React/Redux?"** State updates must produce new references so change detection (and reducers) work; mutating shared nested state breaks it.
- **"Is spread ever a real deep clone?"** Only for flat objects with no nested references.
- **"How do you clone a `Map` deeply?"** `structuredClone`, or iterate entries and recurse — the JSON trick can't even represent a `Map`.

## Related
[[Prototype-Inheritance]] · [[State-Management]] · [[ES6-Modern-JS]]
