# Type Narrowing & Guards

## Q
`unknown` vs `any` vs `never`? What are type guards and discriminated unions?

## Answer
`any` disables type checking entirely — avoid it, because its unsafety spreads silently to everything it touches. `unknown` is the *safe* top type: a variable can hold anything, but the compiler forces you to narrow it before you use it. `never` is the empty type — a value that can't exist — used to prove a `switch` handled every case. A **type guard** is a boolean function with an `x is T` return signature that tells the compiler the narrowed type, and a **discriminated union** is a union of object types sharing a literal "tag" field, which lets `switch` narrow each branch precisely — the type-safe way to model state machines and Redux actions.

## How it works
TypeScript narrows a variable's type inside conditional blocks based on `typeof`, `instanceof`, `in`, `Array.isArray`, and custom `x is T` guards. In a `switch` over a discriminated union, matching the discriminant literal narrows to that member. Assigning the checked value to a `never` in the `default` branch makes the compiler error if any union member was left unhandled — so adding a new variant surfaces every switch that forgot it.

## Code
```ts
// unknown forces narrowing before use
function parse(input: unknown) {
  // input.toUpperCase();                 // error — must narrow first
  if (typeof input === "string") input.toUpperCase(); // ok inside the guard
}

// custom type guard: the `x is string` return teaches the compiler
function isString(x: unknown): x is string {
  return typeof x === "string";
}

// the built-in narrowing techniques
function describe(v: unknown, obj: object) {
  if (typeof v === "string") v.toUpperCase(); // primitives
  if (v instanceof Date) v.getTime();          // class instances
  if ("role" in obj) { /* obj has a role */ }  // property presence
  if (Array.isArray(v)) v.length;              // arrays
}

// discriminated union — the preferred pattern
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  switch (s.kind) {                 // `kind` is the discriminant
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
    default: {
      const _exhaustive: never = s; // compile error if a case is missing
      return _exhaustive;
    }
  }
}
```

## Gotchas
- Returning a plain `boolean` instead of `x is T` from a guard does **not** narrow — the `is` predicate is what teaches the compiler.
- `typeof null === "object"`, so a `typeof x === "object"` guard still includes `null` — check for it explicitly.
- The `never` exhaustiveness trick only fires when the union is a *closed* set of literals; a `string` discriminant won't catch missing cases.
- Type guards are trusted, not verified — a wrong guard body (`return typeof x === "number"` for `x is string`) lies to the compiler at runtime.

## Follow-ups
- **"unknown vs any in practice?"** Type external boundaries (`JSON.parse`, form input, `fetch` bodies) as `unknown`, then validate — often with a schema library like Zod — before use.
- **"Where do discriminated unions shine?"** `useReducer`/Redux actions keyed on `type`, and modeling loading/success/error state as one union.
- **"How does `in` narrowing work?"** `"role" in obj` narrows to the union members that declare `role`.

## Related
[[Generics]] · [[State-Management]]
