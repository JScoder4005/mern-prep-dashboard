# Types vs Interfaces

## Q
What's the difference between `type` and `interface`? When do you use each?

## Answer
Both describe object shapes, and for a plain object they're interchangeable. `interface` is open — it supports declaration merging and reads naturally with `extends`, which makes it the right choice for public API/library contracts and class shapes that consumers may augment. `type` is more expressive: it can alias unions, primitives, tuples, function signatures, and mapped/conditional types — things an `interface` simply can't express. Common rule of thumb: reach for `interface` when describing an object or class contract, and `type` for everything else (unions, tuples, computed types).

## How it works
An `interface` can be declared multiple times and the declarations *merge* into one — powerful for extending third-party types, but it also means an interface is never "closed." A `type` alias is a single fixed definition; you compose them with `&` (intersection) instead of `extends`, and only `type` can capture a union (`string | number`), a tuple (`[number, number]`), or a mapped type (`{ [K in keyof T]: … }`). A class can `implements` either.

## Code
```ts
// interface — extendable and mergeable
interface User {
  id: number;
  name: string;
}
interface User { email: string; } // declaration merging — adds to the same User
interface Admin extends User { role: string; }

// type — unions, tuples, intersections
type ID = string | number;             // union — an interface cannot express this
type Point = { x: number; y: number };
type Pair = [number, number];          // tuple
type AdminT = User & { role: string }; // intersection ≈ extends

// a class can implement either
class UserAccount implements User {
  id = 1;
  name = "x";
  email = "y";
}
```

## Key differences
| Feature | interface | type |
|---|---|---|
| Object shape | ✅ | ✅ |
| Union / primitive alias | ❌ | ✅ |
| Tuple | ❌ | ✅ |
| Extend | `extends` | `&` intersection |
| Declaration merging | ✅ | ❌ |
| Mapped / conditional | ❌ | ✅ |

## Gotchas
- Declaration merging is a feature *and* a footgun: two same-named interfaces in scope silently merge, which can produce surprising shapes — `type` errors instead on a duplicate name.
- Extending a union with an interface is impossible (`interface X extends SomeUnion` fails) — use `type` and `&`.
- Error messages for `interface` are often shorter/clearer; deeply nested `type` intersections can produce noisy diagnostics.
- Performance at scale: the compiler caches interfaces more effectively than large intersection `type`s in some hot paths — rarely matters, occasionally cited.

## Follow-ups
- **"Can `type` do everything `interface` does?"** Almost — except declaration merging, which only `interface` supports.
- **"Which for React props?"** Either; use `type` when props include a union (e.g. a discriminated `variant`), `interface` for plain object props.
- **"extends vs `&`?"** `extends` checks assignability as it composes; `&` blindly intersects, which can yield `never` for conflicting members.

## Related
[[Generics]] · [[Utility-Types]]
