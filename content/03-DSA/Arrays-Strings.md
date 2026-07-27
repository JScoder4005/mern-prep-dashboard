# DSA — Arrays & Strings

> The bread-and-butter of every interview. Rule of thumb: know each problem **with a built-in** (fast to write) *and* **without** (interviewers love "now do it manually"). Every code block below is self-contained and prints its result, so you can run it inline.

---

## 1. Reverse an Array

### Q
Reverse an array. Show it with and without built-in methods, and say which mutates.

### Answer
`arr.reverse()` is O(n) but **mutates in place**. If the caller still needs the original, copy first (`[...arr].reverse()`). Manually, the interview answer is the **two-pointer swap**: walk one index in from each end, swap, stop when they meet — O(n) time, O(1) extra space.

### With built-in
```js
const arr = [1, 2, 3, 4];
console.log([...arr].reverse()); // [4,3,2,1] — copy, original untouched
console.log(arr);                // [1,2,3,4]
```

### Without built-in (two pointers, in-place) — O(n) time, O(1) space
```js
function reverse(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]]; // swap ends
    left++;
    right--;
  }
  return arr;
}
console.log(reverse([1, 2, 3, 4])); // [4,3,2,1]
```

**Why two pointers:** O(1) extra space vs O(n) to build a new array. Foundation for palindrome checks, string reversal, in-place rotations.

---

## 2. Reverse a String

### Q
Reverse a string. Note that JS strings are immutable.

### Answer
Strings can't be mutated character-by-character, so you either split to an array or build a fresh string. `s.split("").reverse().join("")` is the one-liner; manually, prepend/append in a loop. Watch out for emoji/surrogate pairs — `split("")` breaks them; `[...s]` iterates code points correctly.

### With built-in
```js
const rev = (s) => s.split("").reverse().join("");
console.log(rev("hello")); // "olleh"
```

### Without built-in
```js
function reverseStr(s) {
  let out = "";
  for (let i = s.length - 1; i >= 0; i--) out += s[i];
  return out;
}
console.log(reverseStr("hello")); // "olleh"
```

**Gotcha:** for Unicode, `[...s].reverse().join("")` is safer than `s.split("")` — spread iterates by code point, not UTF-16 unit.

---

## 3. Check Palindrome

### Q
Is a string a palindrome? Do it without building a reversed copy.

### Answer
The space-optimal way is two pointers from both ends comparing inward — O(n) time, O(1) space — instead of reversing and comparing (which allocates a whole new string).

### With built-in
```js
const isPal = (s) => s === s.split("").reverse().join("");
console.log(isPal("racecar"), isPal("hello")); // true false
```

### Without built-in (two pointers) — O(1) space
```js
function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}
console.log(isPalindrome("racecar"), isPalindrome("hello")); // true false
```

**Follow-up — "valid palindrome ignoring case/punctuation?"** Normalize first: `s.toLowerCase().replace(/[^a-z0-9]/g, "")`, then run the same two-pointer scan.

---

## 4. Find Max / Min (without Math.max)

### Q
Find the maximum of an array without `Math.max`.

### Answer
Seed with the first element and scan once, keeping the running best — O(n). `Math.max(...arr)` works but spreads a huge array onto the call stack and can blow the argument limit (~100k+ elements), so the manual loop is safer at scale.

```js
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}
console.log(findMax([3, 9, 1, 7])); // 9
// with built-in: Math.max(...[3,9,1,7]) === 9
```

**Gotcha:** `Math.max()` with no args is `-Infinity`; seeding with `arr[0]` avoids that and handles all-negative arrays correctly.

---

## 5. Two Sum — the classic

### Q
Return the indices of the two numbers that add up to `target`.

### Answer
Brute force is O(n²) nested loops. The optimal is a **hashmap**: for each number, check if its complement (`target - num`) was already seen — one pass, O(n) time, O(n) space. This "store complements" trick is the whole pair-sum family.

### Brute force — O(n²)
```js
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j];
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9)); // [0,1]
```

### Optimal — hashmap O(n)
```js
function twoSum(nums, target) {
  const seen = new Map();               // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9)); // [0,1]
```

**Why:** trade O(n) space for O(n) time. See [[Hashing]] for the pattern. If the array were **sorted**, two pointers would solve it in O(1) space instead — see [[Two-Pointers]].

---

## 6. Max Subarray Sum (Kadane) — O(n)

### Q
Find the largest sum of any contiguous subarray.

### Answer
Kadane's algorithm: at each index decide whether to **extend** the current run or **restart** from here (`max(nums[i], cur + nums[i])`), tracking the best seen. It's O(n) DP — the state is just "best sum ending at i".

```js
function maxSubArray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]); // extend or restart
    best = Math.max(best, cur);
  }
  return best;
}
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6  (subarray [4,-1,2,1])
```

**Gotcha:** seed with `nums[0]`, not `0` — an all-negative array like `[-3,-1,-2]` should return `-1`, not `0`.

---

## 7. Remove Duplicates

### Q
Remove duplicate values, preserving first-seen order.

### Answer
`[...new Set(arr)]` is the idiomatic O(n). Manually, track a "seen" set/object and push only first occurrences — a `Set` keeps it O(n) and, unlike a plain object, doesn't coerce keys to strings (so `1` and `"1"` stay distinct).

### With built-in
```js
console.log([...new Set([1, 2, 2, 3, 1])]); // [1,2,3]
```

### Without built-in
```js
function unique(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    if (!seen.has(x)) { seen.add(x); out.push(x); }
  }
  return out;
}
console.log(unique([1, 2, 2, 3, 1])); // [1,2,3]
```

**Gotcha:** the old `seen = {}` trick treats `1` and `"1"` as the same key and misfires on the value `0` if you test `if (!seen[x])`. A `Set` avoids both bugs.

---

## 8. Flatten Nested Array

### Q
Flatten an arbitrarily nested array.

### Answer
`arr.flat(Infinity)` handles any depth. Manually it's a recursion (or an explicit stack): for each element, recurse if it's an array, otherwise collect it.

### With built-in
```js
console.log([1, [2, [3, [4]]]].flat(Infinity)); // [1,2,3,4]
```

### Without built-in (recursion)
```js
function flatten(arr) {
  const out = [];
  for (const x of arr) {
    if (Array.isArray(x)) out.push(...flatten(x)); // recurse into sub-array
    else out.push(x);
  }
  return out;
}
console.log(flatten([1, [2, [3, [4]]]])); // [1,2,3,4]
```

**Follow-up — "avoid recursion?"** Use a stack: push all elements, pop; if it's an array push its items back, else prepend to the result. Avoids stack overflow on very deep nesting.

---

## 9. Group Anagrams

### Q
Group words that are anagrams of each other.

### Answer
Two words are anagrams iff their sorted letters match — so use the **sorted string as a map key** and bucket words under it. O(n·k log k) for n words of length k. A counting-based key (`a2b1...`) drops the sort to O(n·k).

```js
function groupAnagrams(words) {
  const map = new Map();
  for (const w of words) {
    const key = w.split("").sort().join(""); // sorted letters = anagram signature
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(w);
  }
  return [...map.values()];
}
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat","tea","ate"],["tan","nat"],["bat"]]
```

**Why a Map:** insertion order is preserved and keys aren't coerced — cleaner than a plain object here.

---

## 10. Rotate Array by k

### Q
Rotate an array right by `k` steps, in place.

### Answer
The **reversal trick**: reverse the whole array, then reverse the first `k` and the rest separately. That lands every element in its rotated spot in O(1) extra space. Take `k % n` first so `k > n` still works.

```js
function rotate(nums, k) {
  const n = nums.length;
  k %= n;
  reverse(nums, 0, n - 1);   // reverse all
  reverse(nums, 0, k - 1);   // reverse first k
  reverse(nums, k, n - 1);   // reverse the rest
  function reverse(a, l, r) {
    while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; }
  }
  return nums;
}
console.log(rotate([1, 2, 3, 4, 5, 6, 7], 3)); // [5,6,7,1,2,3,4]
```

**Why reversal:** O(1) space vs O(k) for a temp buffer or O(n·k) for one-by-one shifts.

## Related
[[Hashing]] · [[Two-Pointers]] · [[Sliding-Window]]
