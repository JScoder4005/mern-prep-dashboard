# DSA — Hashing (Map / Set)

## Q
When use a hashmap? Solve frequency, first-unique, group problems in O(n).

## A
Hash (`Map`/`Set`/object) gives O(1) average lookup/insert. Trade space for time. Turns O(n²) scans into O(n).

## Code
Frequency count:
```js
function freq(arr) {
  const map = new Map();
  for (const x of arr) map.set(x, (map.get(x) || 0) + 1);
  return map;
}
```

First non-repeating char:
```js
function firstUnique(s) {
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) || 0) + 1);
  for (let i = 0; i < s.length; i++) if (count.get(s[i]) === 1) return i;
  return -1;
}
```

Contains duplicate:
```js
function hasDup(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}
```

Valid anagram:
```js
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = {};
  for (const c of a) count[c] = (count[c] || 0) + 1;
  for (const c of b) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}
```

Two sum → see [[Arrays-Strings]].

## Map vs Object vs Set
| | use |
|---|---|
| `Map` | any key type, ordered, `.size`, iterate easy |
| `Object` | string/symbol keys, JSON |
| `Set` | unique values, membership test |

## How
Store seen values/complements/counts. Single pass checks against hash.

## Why
O(1) lookup collapses nested loops. Core of most "optimize this" answers.

## Where / Scenario
Dedup, counting, grouping, caching, "seen before" checks, two-sum family.

## Related
[[Arrays-Strings]] · [[Sliding-Window]]
