# DSA — Arrays & Strings

> Every problem: **with inbuilt method** + **without inbuilt (manual loop)**. Interviewers often say "now do it without built-in."

---

## 1. Reverse an Array

### Q
Reverse an array. Show with and without built-in methods.

### With inbuilt
```js
const reverseBuiltin = (arr) => arr.reverse();        // mutates original
const reverseCopy = (arr) => [...arr].reverse();      // non-mutating
const reverseReduce = (arr) => arr.reduce((acc, x) => [x, ...acc], []);
```

### Without inbuilt (two pointers, in-place) — O(n) time, O(1) space
```js
function reverse(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]]; // swap
    left++;
    right--;
  }
  return arr;
}
reverse([1, 2, 3, 4]); // [4,3,2,1]
```

### Without inbuilt (new array)
```js
function reverse(arr) {
  const out = [];
  for (let i = arr.length - 1; i >= 0; i--) out[out.length] = arr[i];
  return out;
}
```

**How:** swap ends moving inward until pointers meet.
**Why two pointers:** O(1) extra space vs building new array O(n).
**Where:** foundation for palindrome, string reverse, in-place rotations.

---

## 2. Reverse a String

### Q
Reverse a string (strings are immutable in JS).

### With inbuilt
```js
const rev = (s) => s.split("").reverse().join("");
```

### Without inbuilt
```js
function reverseStr(s) {
  let out = "";
  for (let i = s.length - 1; i >= 0; i--) out += s[i];
  return out;
}
```
**Note:** strings immutable → must build new string / array.

---

## 3. Check Palindrome

### With inbuilt
```js
const isPal = (s) => s === s.split("").reverse().join("");
```

### Without inbuilt (two pointers) — O(1) space
```js
function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}
```
**Where:** validate palindrome, "valid palindrome II" (skip one char).

---

## 4. Find Max / Min (without Math.max)

```js
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}
// with inbuilt: Math.max(...arr)
```

---

## 5. Two Sum — the classic

### Q
Return indices of two numbers adding to target.

### Brute force O(n²)
```js
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j];
}
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
```
**How:** store complement lookups. **Why:** trade O(n) space for O(n) time. **Where:** pair-sum family, see [[Hashing]].

---

## 6. Max Subarray Sum (Kadane) — O(n)

```js
function maxSubArray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]); // extend or restart
    best = Math.max(best, cur);
  }
  return best;
}
```
**Why:** DP — at each index keep best sum ending here. **Where:** max profit windows, contiguous sums.

---

## 7. Remove Duplicates

### With inbuilt
```js
const unique = (arr) => [...new Set(arr)];
```

### Without inbuilt
```js
function unique(arr) {
  const seen = {};
  const out = [];
  for (const x of arr) {
    if (!seen[x]) { seen[x] = true; out.push(x); }
  }
  return out;
}
```

---

## 8. Flatten Nested Array

### With inbuilt
```js
const flat = (arr) => arr.flat(Infinity);
```

### Without inbuilt (recursion)
```js
function flatten(arr) {
  const out = [];
  for (const x of arr) {
    if (Array.isArray(x)) out.push(...flatten(x)); // recurse
    else out.push(x);
  }
  return out;
}
flatten([1, [2, [3, [4]]]]); // [1,2,3,4]
```

---

## 9. Group Anagrams

```js
function groupAnagrams(words) {
  const map = new Map();
  for (const w of words) {
    const key = w.split("").sort().join(""); // sorted = anagram signature
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(w);
  }
  return [...map.values()];
}
```

---

## 10. Rotate Array by k

```js
function rotate(nums, k) {
  k %= nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
  function reverse(a, l, r) {
    while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; }
  }
}
// reversal trick: O(1) space
```

## Related
[[Hashing]] · [[Two-Pointers]] · [[Sliding-Window]]
