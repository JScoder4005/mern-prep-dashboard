# DSA — Sliding Window

## Q
Explain sliding window. Solve longest substring without repeat, max sum window k, min window.

## A
Maintain a window `[left, right]` over the array/string, expand right, shrink left when a condition breaks. Turns nested-loop O(n²) into O(n). Two kinds: **fixed size** and **variable size**.

## Code
Fixed window — max sum of k:
```js
function maxSumK(arr, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i]; // first window
  let max = sum;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];              // slide: add new, drop old
    max = Math.max(max, sum);
  }
  return max;
}
```

Variable window — longest substring without repeating:
```js
function longestUnique(s) {
  const seen = new Map();   // char -> last index
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (seen.has(c) && seen.get(c) >= left) {
      left = seen.get(c) + 1;  // jump left past duplicate
    }
    seen.set(c, right);
    max = Math.max(max, right - left + 1);
  }
  return max;
}
longestUnique("abcabcbb"); // 3 ("abc")
```

Min window / longest with at most k distinct = same template (shrink while invalid).

## How
`right` grows window; when constraint violated, advance `left` until valid again. Each index enters/leaves once → O(n).

## Why
Reuses previous computation instead of recomputing each subarray.

## Where / Scenario
Substrings, subarrays with sum/length/distinct constraints, rate limiting (requests in time window), streaming max.

## Related
[[Hashing]] · [[Two-Pointers]] · [[Arrays-Strings]]
