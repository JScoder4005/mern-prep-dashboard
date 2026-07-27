# DSA — Hashing (Map / Set)

## Q
When do you reach for a hashmap? Solve frequency counting, first-unique, and duplicate/anagram checks in O(n).

## Answer
A hash structure (`Map`, `Set`, or a plain object) gives O(1) average insert and lookup, so it's the go-to for trading space for time. Any time a brute-force answer is nested loops "for each x, scan for a match", a hash of what you've already **seen** (or the counts you've accumulated) collapses it to a single O(n) pass. It's the single most common "now optimize it" answer in interviews.

## How it works
You keep a running structure as you scan once: a **count** map for frequency problems, a **seen** set for membership/dedup, or a **complement** map for pair-sums. Because each lookup is O(1), the total is O(n). Prefer `Map`/`Set` over a plain object — objects coerce keys to strings (so `1` and `"1"` collide) and inherit prototype keys.

## Code
Frequency count:
```js
function freq(arr) {
  const map = new Map();
  for (const x of arr) map.set(x, (map.get(x) || 0) + 1);
  return map;
}
console.log([...freq(["a", "b", "a", "c", "b", "a"])]); // [["a",3],["b",2],["c",1]]
```

First non-repeating character (returns its index):
```js
function firstUnique(s) {
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) || 0) + 1);
  for (let i = 0; i < s.length; i++) if (count.get(s[i]) === 1) return i;
  return -1;
}
console.log(firstUnique("leetcode")); // 0  ('l')
console.log(firstUnique("aabb"));     // -1 (none unique)
```

Contains duplicate (early-exit Set):
```js
function hasDup(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}
console.log(hasDup([1, 2, 3, 1]), hasDup([1, 2, 3])); // true false
```

Valid anagram (count up, then down):
```js
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = new Map();
  for (const c of a) count.set(c, (count.get(c) || 0) + 1);
  for (const c of b) {
    if (!count.get(c)) return false;   // missing or already exhausted
    count.set(c, count.get(c) - 1);
  }
  return true;
}
console.log(isAnagram("listen", "silent"), isAnagram("rat", "car")); // true false
```

## Map vs Object vs Set
| Structure | Reach for it when |
|---|---|
| `Map` | any key type, insertion-ordered, `.size`, easy iteration, frequent add/delete |
| `Object` | string/symbol keys, JSON shape, static record |
| `Set` | unique values, pure membership tests |

## Gotchas
- A plain object coerces keys to strings — `map[1]` and `map["1"]` are the same bucket, and numeric keys lose their type. `Map` keeps keys as-is.
- Truthiness checks like `if (!count[c])` misfire when a legitimate count is `0` — the anagram code above relies on that intentionally (a used-up char reads as falsy), but be deliberate about it.
- `Map` iterates in insertion order; a plain object mostly does too but sorts integer-like keys numerically — a subtle ordering trap.

## Follow-ups
- **"Why Map over object for a cache?"** Any key type, real `.size`, no prototype-pollution risk, and better perf for frequent adds/deletes.
- **"O(1) is average — when does it degrade?"** Pathological key collisions can push a hash toward O(n), but JS engine maps are effectively O(1) for normal data.

## Related
[[Arrays-Strings]] · [[Sliding-Window]] · [[Two-Pointers]]
