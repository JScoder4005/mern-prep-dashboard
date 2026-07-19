# JavaScript — Iterators & Generators

## Q
What are iterators and generators? `Symbol.iterator`? Use cases for `function*` / `yield`?

## A
- **Iterable** — object with `[Symbol.iterator]()` returning an **iterator** (`{ next(): {value, done} }`). Enables `for...of`, spread.
- **Generator** — `function*` that can pause (`yield`) and resume, auto-implements the iterator protocol.

## Code
Custom iterable:
```js
const range = {
  from: 1, to: 5,
  [Symbol.iterator]() {
    let cur = this.from;
    const last = this.to;
    return {
      next: () => (cur <= last ? { value: cur++, done: false } : { value: undefined, done: true }),
    };
  },
};
[...range];            // [1,2,3,4,5]
for (const n of range) console.log(n);
```

Generator (same, cleaner):
```js
function* rangeGen(from, to) {
  for (let i = from; i <= to; i++) yield i; // pause at each yield
}
[...rangeGen(1, 5)]; // [1,2,3,4,5]

const g = rangeGen(1, 3);
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
```

Infinite lazy sequence (generators shine here):
```js
function* idGenerator() {
  let id = 1;
  while (true) yield id++;   // never runs out, lazy
}
const gen = idGenerator();
gen.next().value; // 1
gen.next().value; // 2
```

Two-way communication:
```js
function* chat() {
  const name = yield "What's your name?"; // yield out, receive back
  yield `Hello ${name}`;
}
const c = chat();
c.next().value;        // "What's your name?"
c.next("Varun").value; // "Hello Varun"
```

Async generator (stream pages):
```js
async function* fetchPages(url) {
  let page = 1, more = true;
  while (more) {
    const res = await fetch(`${url}?page=${page++}`).then((r) => r.json());
    more = res.hasMore;
    yield res.items;
  }
}
for await (const items of fetchPages("/api/feed")) render(items);
```

## How
`yield` pauses the generator, returning control to caller; `.next()` resumes from there, optionally injecting a value. Lazy — computes only on demand.

## Why / Where
- Lazy/infinite sequences (IDs, fibonacci) without storing all.
- Custom iteration for classes/data structures.
- Async streams / pagination (`for await...of`).
- Redux-Saga uses generators for side effects.

## Related
[[ES6-Modern-JS]] · [[Async-Promises]]
