# JavaScript — Type Coercion & Equality

## Q
`==` vs `===`? Explain coercion rules, truthy/falsy, `NaN`, and the famous traps.

## Answer
`===` is strict equality — no coercion, it compares type *and* value. `==` is loose equality — it coerces the operands to a common type (usually number) before comparing, which is why `1 == "1"` is `true`. Rule of thumb: always use `===` and be explicit about conversions; the only common exception is `x == null` to catch both `null` and `undefined`. Coercion also shows up outside `==`: `+` prefers string concatenation if either side is a string, other arithmetic operators force numbers, and `if (...)` conditions coerce to boolean using the eight falsy values.

## How it works
- `==` runs the *abstract equality* algorithm: different types get coerced (typically to number) then compared; `null == undefined` is a hard-coded `true` and neither coerces to anything else.
- `+` is overloaded: string if either operand is a string, otherwise numeric. `-`, `*`, `/` always coerce to number.
- Objects coerce to primitives via `valueOf()` then `toString()` (arrays stringify to comma-joined values).
- The **eight** falsy values are: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else — including `[]`, `{}`, `"0"`, `"false"` — is truthy.

## Code
Strict vs loose:
```js
console.log(1 === "1"); // false — different types, no coercion
console.log(1 == "1");  // true  — "1" coerced to number
console.log(0 == false, "" == false, null == undefined); // true true true
console.log(null == 0);  // false — null only loosely equals undefined
```

The `+` operator and arithmetic coercion:
```js
console.log(1 + "2");   // "12" — string concatenation wins
console.log("5" - 2);   // 3    — minus forces numbers
console.log(1 + true);  // 2    — true becomes 1
console.log([] + {});   // "[object Object]"
```

Truthy / falsy:
```js
console.log(Boolean(""), Boolean(0), Boolean(NaN));   // false false false
console.log(Boolean("0"), Boolean([]), Boolean({}));  // true true true
if ([]) console.log("empty array is truthy");
```

`NaN` — the value that isn't equal to itself:
```js
console.log(NaN === NaN);       // false — NaN never equals itself
console.log(Number.isNaN(NaN)); // true  — the correct check
console.log(isNaN("abc"));      // true  — coerces first (avoid the global)
console.log(typeof NaN);        // "number"
```

Famous traps:
```js
console.log([] == ![]);         // true  — ![] is false->0, [] is ""->0, 0==0
console.log(0.1 + 0.2 === 0.3); // false — IEEE-754 floating point
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true — safe compare
console.log(typeof null);       // "object" — historic bug
console.log([1, 2, 3] == "1,2,3"); // true — array stringifies
```

## Gotchas
- `??` vs `||`: `0 || "x"` is `"x"` (0 is falsy) but `0 ?? "x"` is `0` — use `??` for defaults when `0`/`""`/`false` are valid.
- Never compare floats with `===`; use `Math.abs(a - b) < Number.EPSILON`.
- Prefer `Number.isNaN` over the global `isNaN` — the global coerces its argument first, so `isNaN("abc")` is `true`.
- `typeof null === "object"` and `typeof function(){} === "function"` are the two `typeof` quirks worth memorizing.

## Follow-ups
- **"When is `==` acceptable?"** `x == null` to test for `null` *or* `undefined` in one check — otherwise use `===`.
- **"How does `[] == ![]` become true?"** `![]` evaluates to `false` → `0`; the left `[]` coerces to `""` → `0`; `0 == 0`.
- **"Why is `0.1 + 0.2 !== 0.3`?"** Binary floating point can't represent those decimals exactly, so the sum is `0.30000000000000004`.

## Related
[[Output-Based-Questions]] · [[ES6-Modern-JS]]
