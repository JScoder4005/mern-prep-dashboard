# Types vs Interfaces

## Q
Difference between `type` and `interface`? When use each?

## A
Both describe object shapes. **`interface`** — extendable, mergeable, best for object/class contracts. **`type`** — more flexible: unions, primitives, tuples, mapped/conditional types.

## Code
```ts
// interface
interface User {
  id: number;
  name: string;
}
interface User { email: string; }   // DECLARATION MERGING (adds to same)
interface Admin extends User { role: string; } // extends

// type
type ID = string | number;          // union - interface CAN'T do this
type Point = { x: number; y: number };
type Pair = [number, number];       // tuple
type Admin2 = User & { role: string }; // intersection = extends equivalent

// class implements either
class UserAccount implements User { id = 1; name = "x"; email = "y"; }
```

## Key differences
| Feature | interface | type |
|---|---|---|
| Object shape | ✅ | ✅ |
| Union / primitive | ❌ | ✅ |
| Tuple | ❌ | ✅ |
| Extend | `extends` | `&` intersection |
| Declaration merging | ✅ | ❌ |
| Mapped/conditional | ❌ | ✅ |

## Why / Where
- **interface** — public API, class contract, library types (mergeable = extensible).
- **type** — unions, function signatures, utility/computed types, React props with unions.
- Rule of thumb: interface for objects, type for everything else.

## Related
[[Generics]] · [[Utility-Types]]
