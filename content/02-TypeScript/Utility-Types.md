# Utility Types

## Q
Explain `Partial`, `Pick`, `Omit`, `Record`, `Readonly`, `Required`. Implement your own `Pick`.

## A
Built-in generic type transformers. Save rewriting variant types.

## Code
```ts
interface User {
  id: number;
  name: string;
  email: string;
}

Partial<User>;              // all optional  { id?, name?, email? }
Required<Partial<User>>;    // all required back
Readonly<User>;             // all readonly (immutable)
Pick<User, "id" | "name">;  // subset { id, name }
Omit<User, "email">;        // remove key { id, name }
Record<string, User>;       // { [k: string]: User } dictionary

// real usage
function updateUser(id: number, patch: Partial<User>) {} // patch = any subset
const usersById: Record<number, User> = {};
```

Implement own utility types (senior signal):
```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;
type MyRecord<K extends string | number | symbol, V> = { [P in K]: V };
```

## How
**Mapped types** `[K in keyof T]` iterate keys. Modifiers `?` (optional), `readonly`, `-?` (remove optional). `Exclude<A,B>` removes B from union A.

## Why
DRY types — derive variants from one source of truth. Change base → all derived update.

## Where / Scenario
- `Partial` — update/patch payloads, optional config.
- `Omit` — API responses hiding fields (`Omit<User, "password">`).
- `Pick` — DTOs, form subsets.
- `Record` — lookup maps, enums-to-value.

## Related
[[Generics]] · [[Types-vs-Interfaces]]
