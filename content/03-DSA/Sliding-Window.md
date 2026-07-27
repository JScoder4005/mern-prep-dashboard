# DSA — Sliding Window

## Q
Explain the sliding-window pattern. Solve longest substring without repeats, max sum of a window of size k, and describe the min-window template.

## Answer
Sliding window keeps a contiguous range `[left, right]` over an array or string and reuses work as it moves, instead of recomputing every subarray. There are two flavours: **fixed-size** (window of length k — slide by adding the incoming element and dropping the outgoing one) and **variable-size** (grow `right` greedily, shrink `left` whenever the window violates a constraint). Both are O(n) because each index enters and leaves the window at most once.

## How it works
`right` always advances, expanding the window. For fixed windows you maintain a running aggregate (sum/count) and update it in O(1) per slide. For variable windows you hold an invariant (no repeats / at most k distinct / sum ≥ target) and advance `left` until the invariant holds again, recording the best window as you go.

## Code
Fixed window — max sum of any k consecutive elements:
```js
function maxSumK(arr, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i]; // first window
  let max = sum;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];              // slide: add incoming, drop outgoing
    max = Math.max(max, sum);
  }
  return max;
}
console.log(maxSumK([2, 1, 5, 1, 3, 2], 3)); // 9  (5+1+3)
```

Variable window — longest substring without repeating characters:
```js
function longestUnique(s) {
  const seen = new Map();   // char -> last index seen
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (seen.has(c) && seen.get(c) >= left) {
      left = seen.get(c) + 1;   // jump left past the previous duplicate
    }
    seen.set(c, right);
    max = Math.max(max, right - left + 1);
  }
  return max;
}
console.log(longestUnique("abcabcbb")); // 3  ("abc")
```

Variable window — smallest subarray with sum ≥ target (shrink-while-valid template):
```js
function minSubArrayLen(target, nums) {
  let left = 0, sum = 0, best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {              // shrink while still valid
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return best === Infinity ? 0 : best;
}
console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])); // 2  ([4,3])
```

## Gotchas
- The dedup check `seen.get(c) >= left` matters: a repeat *before* `left` is already outside the window, so don't move `left` backward.
- Fixed vs variable is the first decision — a fixed k means "slide by one"; an unknown length means "grow then shrink".
- Min-window / at-most-k-distinct are the same shrink-while-invalid skeleton — only the invariant and the aggregate change.

## Follow-ups
- **"Why is it O(n) and not O(n²) despite the inner `while`?"** `left` only ever moves forward, across the whole array once total — amortized O(1) per step.
- **"Longest with at most k distinct chars?"** Same template: keep a char→count map, shrink `left` while the map has more than k keys.

## Related
[[Hashing]] · [[Two-Pointers]] · [[Arrays-Strings]]
