# JavaScript — Iterators & Generators

## Q
What are iterators and generators? What is `Symbol.iterator`, and what are `function*` / `yield` for?

## Answer
An **iterable** is any object with a `[Symbol.iterator]()` method that returns an **iterator** — an object with a `next()` method yielding `{ value, done }`. That protocol is what powers `for...of`, spread, and destructuring. A **generator** is a `function*` that can pause at each `yield` and resume on the next `.next()` call; it auto-implements the iterator protocol, so it's the ergonomic way to produce sequences — including lazy or infinite ones — without building the iterator object by hand.

## How it works
`yield` pauses the generator and hands a value back to the caller; the next `.next()` resumes execution right after that `yield`, and can inject a value back in (two-way communication). Because it computes on demand, a generator can model infinite sequences without storing them. `async function*` + `for await...of` extends this to asynchronous streams — the idiomatic shape for paginated APIs (`yield` each page as it arrives).

## Code
Custom iterable via `Symbol.iterator`:
```js
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let cur = this.from;
    const last = this.to;
    return {
      next: () => (cur <= last ? { value: cur++, done: false } : { value: undefined, done: true }),
    };
  },
};
console.log([...range]);                       // [1,2,3,4,5] — spread uses the iterator
console.log([...range].filter((n) => n % 2));  // [1,3,5]
```

The same thing as a generator — far less boilerplate:
```js
function* rangeGen(from, to) {
  for (let i = from; i <= to; i++) yield i; // pause at each yield
}
console.log([...rangeGen(1, 5)]);     // [1,2,3,4,5]
const g = rangeGen(1, 3);
console.log(g.next(), g.next());      // {value:1,done:false} {value:2,done:false}
```

Infinite lazy sequence:
```js
function* ids() {
  let id = 1;
  while (true) yield id++; // never runs out — computed on demand
}
const gen = ids();
console.log(gen.next().value, gen.next().value, gen.next().value); // 1 2 3
```

Two-way communication with `yield`:
```js
function* chat() {
  const name = yield "name?"; // yields out, receives the value passed to next()
  yield `Hello ${name}`;
}
const c = chat();
console.log(c.next().value);        // "name?"
console.log(c.next("Varun").value); // "Hello Varun"
```

Async generator — stream values over time (like paginated fetches):
```js
async function* countdown(n) {
  while (n > 0) {
    yield n--;
    await new Promise((r) => setTimeout(r, 5)); // stands in for an async fetch
  }
}
(async () => {
  const out = [];
  for await (const n of countdown(3)) out.push(n);
  console.log(out); // [3, 2, 1]
})();
```

## Gotchas
- An iterator is single-use: once `done` is `true`, it's exhausted — you re-iterate by getting a *fresh* iterator (`[Symbol.iterator]()` again).
- The **first** `.next()` argument is ignored — there's no paused `yield` yet to receive it.
- An infinite generator with no exit condition will hang a `for...of` or spread — always bound it (`take(n)`, a `break`, etc.).

## Follow-ups
- **"Where are generators used in real code?"** Redux-Saga models side effects as yielded effects; async generators stream paginated API results via `for await...of`.
- **"How do you make a class iterable?"** Give it a `[Symbol.iterator]()` method (often itself a generator).
- **"Lazy vs eager?"** A generator computes each value only when pulled, so it can represent sequences too large or infinite to materialize.

## Related
[[ES6-Modern-JS]] · [[Async-Promises]]
