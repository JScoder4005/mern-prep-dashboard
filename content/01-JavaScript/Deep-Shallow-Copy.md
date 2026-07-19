# Deep vs Shallow Copy

## Q
Difference between shallow and deep copy? How do you deep clone an object?

## A
- **Shallow** — copies top level; nested objects still share references.
- **Deep** — fully independent clone, nested included.

## Code
Shallow:
```js
const a = { x: 1, nested: { y: 2 } };
const shallow = { ...a };          // or Object.assign({}, a)
shallow.nested.y = 99;
a.nested.y; // 99  <-- shared reference! (proves shallow)
```

Deep — modern built-in:
```js
const deep = structuredClone(a);   // best, handles Date/Map/Set/circular
deep.nested.y = 99;
a.nested.y; // 2  (independent)
```

Deep — JSON trick (with caveats):
```js
const deep = JSON.parse(JSON.stringify(a));
// LOSES: functions, undefined, Date->string, Map/Set, circular THROWS
```

Deep — manual recursion (without inbuilt):
```js
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj; // primitive
  if (seen.has(obj)) return seen.get(obj);                 // circular ref
  const copy = Array.isArray(obj) ? [] : {};
  seen.set(obj, copy);
  for (const key of Object.keys(obj)) {
    copy[key] = deepClone(obj[key], seen);
  }
  return copy;
}
```

## How
Spread/`Object.assign` copy only enumerable own props one level. Deep clone must recurse and track visited refs (`WeakMap`) to survive cycles.

## Why
Mutating shared nested state causes hard bugs (esp. React — never mutate state).

## Where / Scenario
- React: update nested state immutably.
- Redux reducers must return new references.
- Clone config/default objects before mutating.

## Related
[[Prototype-Inheritance]] · [[State-Management]]
