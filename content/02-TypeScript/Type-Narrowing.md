# Type Narrowing & Guards

## Q
`unknown` vs `any` vs `never`? What are type guards and discriminated unions?

## A
- **`any`** — turns off type checking (avoid).
- **`unknown`** — safe any; must narrow before use.
- **`never`** — value that can't happen (exhaustive checks).

## Code
```ts
// unknown forces narrowing
function parse(input: unknown) {
  // input.toUpperCase();       // error - must narrow
  if (typeof input === "string") input.toUpperCase(); // ok now
}

// type guards
function isString(x: unknown): x is string {
  return typeof x === "string";
}

// narrowing techniques
typeof v === "string";          // primitives
v instanceof Date;              // classes
"role" in obj;                  // property check
Array.isArray(v);

// discriminated union (BEST pattern)
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  switch (s.kind) {              // `kind` = discriminant
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
    default:
      const _exhaustive: never = s; // compile error if a case missing
      return _exhaustive;
  }
}
```

## How
TS narrows type inside conditional blocks. Custom guard `x is T` tells compiler the narrowed type. `never` in default catches unhandled union members at compile time.

## Why
`unknown` = safe API boundaries (JSON, form input). Discriminated unions = type-safe state machines / Redux actions.

## Where / Scenario
- Redux/reducer action types (discriminated union on `type`).
- API response parsing (`unknown` then validate/zod).
- React `useReducer` action handling.

## Related
[[Generics]] · [[State-Management]]
