# Utility Types

## Q
Explain `Partial`, `Pick`, `Omit`, `Record`, `Readonly`, `Required` — and implement your own `Pick`.

## Answer
Utility types are built-in generic type transformers that derive a new type from an existing one, so you keep a single source of truth instead of hand-writing every variant. `Partial<T>` makes all properties optional, `Required<T>` the reverse; `Readonly<T>` makes them immutable; `Pick<T, K>` keeps a subset of keys and `Omit<T, K>` drops some; `Record<K, V>` builds a dictionary type. They're all just mapped types over `keyof T`, which is why implementing them yourself is a strong senior signal.

## How it works
A **mapped type** `[K in keyof T]` iterates the keys of `T`, and per-key modifiers transform them: `?` adds optionality, `readonly` adds immutability, and the `-?` / `-readonly` modifiers remove them. `Pick` maps over a chosen key union `K`; `Omit` is `Pick` over `Exclude<keyof T, K>` (the keys of `T` minus `K`). Because they derive from `T`, changing the base type automatically updates everything built on it.

## Code
```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;        // { id?; name?; email? }
type BackToRequired = Required<PartialUser>;
type ReadonlyUser = Readonly<User>;      // all properties immutable
type NameCard = Pick<User, "id" | "name">;   // { id; name }
type NoEmail = Omit<User, "email">;          // { id; name }
type UserMap = Record<number, User>;         // { [id: number]: User }

// real usage
function updateUser(id: number, patch: Partial<User>) {} // patch = any subset
const usersById: Record<number, User> = {};
```

Implement them from scratch (the senior signal):
```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;
type MyRecord<K extends string | number | symbol, V> = { [P in K]: V };
```

## Gotchas
- `Partial` is shallow — nested objects stay required. A deep-partial needs a recursive mapped type.
- `Omit` doesn't check that the removed key exists (`Omit<User, "typo">` won't error unless you constrain `K extends keyof T` yourself) — the built-in is deliberately permissive.
- `Readonly` is compile-time only; it doesn't `Object.freeze` anything at runtime.
- `Pick`/`Omit` operate on the *type*, not values — you still have to build the actual object that matches.

## Follow-ups
- **"How does `Omit` actually work?"** It's `Pick<T, Exclude<keyof T, K>>` — pick every key except the excluded ones.
- **"Common real uses?"** `Omit<User, "password">` for API responses, `Partial<T>` for PATCH payloads, `Record<Role, Permissions>` for lookup maps, `Pick` for form/DTO subsets.
- **"What's a mapped type modifier you'd mention?"** `-?` strips optionality (that's how `Required` is built), `-readonly` strips immutability.

## Related
[[Generics]] · [[Types-vs-Interfaces]]
