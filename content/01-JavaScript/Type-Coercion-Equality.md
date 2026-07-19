# JavaScript — Type Coercion & Equality

## Q
`==` vs `===`? Explain coercion rules, truthy/falsy, `NaN`, famous traps.

## A
- `===` strict — no coercion, compares type + value.
- `==` loose — coerces types then compares (avoid; use `===`).
Coercion converts between string/number/boolean automatically in operations.

## Code
```js
// === vs ==
1 === "1";   // false (different types)
1 == "1";    // true  (coerced)
0 == false;  // true
"" == false; // true
null == undefined; // true
null == 0;   // false  (special rule)

// + operator: string wins
1 + "2";     // "12"
"5" - 2;     // 3   (- forces number)
1 + true;    // 2
[] + [];     // ""
[] + {};     // "[object Object]"
```

## Falsy values (only these 8)
```
false, 0, -0, 0n, "", null, undefined, NaN
```
Everything else truthy — including `[]`, `{}`, `"0"`, `"false"`.
```js
if ([]) console.log("runs");   // [] is truthy
Boolean("0");                  // true
Boolean(0);                    // false
```

## NaN
```js
NaN === NaN;         // false (NaN not equal to itself)
Number.isNaN(NaN);   // true  (correct check)
isNaN("abc");        // true  (coerces first - avoid)
typeof NaN;          // "number"
```

## Famous traps
```js
[] == ![];           // true
// ![] -> false -> 0; [] -> "" -> 0; 0 == 0 -> true

0.1 + 0.2 === 0.3;   // false (IEEE 754 float)
// fix: Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON

typeof null;         // "object" (historic bug)
typeof NaN;          // "number"
typeof function(){}; // "function"
[1,2,3] == "1,2,3";  // true (array -> string)
```

## Nullish vs falsy (`??` vs `||`)
```js
0 || "default";      // "default" (0 is falsy)
0 ?? "default";      // 0 (?? only null/undefined)
"" ?? "x";           // "" 
null ?? "x";         // "x"
```

## How
`==` follows abstract equality algorithm (coerces to number usually). `+` prefers string if either operand is string. Objects → primitive via `valueOf`/`toString`.

## Why matters
- Bugs from implicit coercion (`0`, `""` falsy).
- Use `===`, `Number.isNaN`, `??` for defaults.
- Float compare with epsilon.

## Related
[[Output-Based-Questions]] · [[ES6-Modern-JS]]
