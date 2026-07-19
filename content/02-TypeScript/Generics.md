# Generics

## Q
What are generics? Explain `keyof`, `extends` constraint, generic constraints.

## A
Generics = type variables. Write reusable code that keeps type safety across many types instead of using `any`.

## Code
```ts
// basic
function identity<T>(x: T): T { return x; }
identity<string>("hi");
identity(42); // inferred number

// generic constraint (extends)
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest([1, 2], [1]);      // ok - arrays have length
longest("aa", "b");        // ok - strings have length
// longest(1, 2);          // error - number has no length

// keyof - typed property access
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { id: 1, name: "Varun" };
getProp(user, "name"); // type string
// getProp(user, "xyz"); // error - not a key

// generic interface / class
interface ApiResponse<T> {
  data: T;
  status: number;
}
const res: ApiResponse<User[]> = { data: [], status: 200 };
```

## How
Type inferred at call site or passed explicitly. `extends` narrows what T can be. `keyof T` = union of T's keys. `T[K]` = indexed access type.

## Why
Reuse + safety. Avoids `any` (which kills type checking).

## Where / Scenario
- Generic API fetch wrapper `fetch<T>()`.
- Reusable React components `<List<T>>`.
- Utility functions (map, filter typed).
- Repository/DAO layer in Node.

## Related
[[Utility-Types]] · [[Types-vs-Interfaces]]
