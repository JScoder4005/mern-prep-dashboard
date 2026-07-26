# Generics

## Q
What are generics? Explain `keyof`, the `extends` constraint, and generic constraints.

## Answer
Generics are type variables — they let you write a function, class, or type once and have it work across many concrete types while keeping full type safety, instead of falling back to `any` (which switches type-checking off). The type argument is either inferred from the call site or passed explicitly. `extends` constrains what a type parameter is allowed to be, `keyof T` produces the union of `T`'s property keys, and indexed access `T[K]` gives the type of a specific property — together they let you write helpers that stay provably correct for any shape you pass in.

## How it works
At each call the compiler infers the type argument from the arguments (or you supply it in angle brackets). A constraint like `T extends { length: number }` restricts `T` to types that have a `length`, so the body can safely read it. `K extends keyof T` ties a key parameter to the object's real keys, and the return type `T[K]` is the exact property type — so `getProp(user, "name")` is typed `string`, while passing a non-key is a compile error.

## Code
```ts
// basic — T is inferred or explicit
function identity<T>(x: T): T { return x; }
identity<string>("hi"); // T = string
identity(42);           // T inferred as number

// constraint: T must have a length
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest([1, 2], [1]); // ok — arrays have length
longest("aa", "b");   // ok — strings have length
// longest(1, 2);     // error — number has no length

// keyof + indexed access — type-safe property lookup
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { id: 1, name: "Varun" };
getProp(user, "name"); // typed string
// getProp(user, "xyz"); // error — "xyz" is not a key of user

// generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
}
const res: ApiResponse<number[]> = { data: [1, 2], status: 200 };
```

## Gotchas
- A bare `<T>` with no constraint knows *nothing* about `T` — you can't read properties or call methods on it until you constrain it with `T extends …`.
- Generics are erased at runtime — you can't do `new T()` or `x instanceof T`; pass a constructor/factory or a runtime tag instead.
- Default type params (`<T = string>`) plus inference can silently widen a type — annotate when you need a specific one.
- Don't reach for generics when a plain union or an overload is clearer; over-generic signatures hurt readability more than they help.

## Follow-ups
- **"`keyof` on a union type?"** `keyof (A | B)` is the *intersection* of their keys — only the properties both have.
- **"Constrain to keys whose value is a certain type?"** Combine `keyof` with a conditional/mapped type to filter the key union.
- **"Where do generics show up in React?"** Typed hooks (`useState<T>`), generic list/table components, and typed `fetch<T>()` wrappers.

## Related
[[Utility-Types]] · [[Types-vs-Interfaces]]
