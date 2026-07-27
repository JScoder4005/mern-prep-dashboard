# DSA — Two Pointers

## Q
Explain the two-pointer pattern. Solve pair sum on a sorted array, 3-sum, and container with most water.

## Answer
Two-pointer is a family of techniques where you keep two indices and move them intelligently instead of nesting loops. The two shapes are **converging** (one from each end, moving inward — needs a **sorted** array so a comparison tells you which side to move) and **same-direction** (a slow/fast pair, e.g. in-place partitioning or cycle detection). It collapses an O(n²) or O(n³) scan into O(n) or O(n²) with O(1) extra space.

## How it works
On a sorted array, the sum of the two ends tells you exactly what to do: too small → move the left pointer up (bigger value), too big → move the right pointer down. Each element is visited once, so the inner loop disappears. For triplets you fix one element and two-pointer the rest; skipping equal neighbors keeps results unique.

## Code
Pair sum on a **sorted** array — O(n), O(1) space:
```js
function pairSum(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    const sum = arr[l] + arr[r];
    if (sum === target) return [l, r];
    if (sum < target) l++;   // need a bigger sum
    else r--;                // need a smaller sum
  }
  return [];
}
console.log(pairSum([1, 3, 4, 6, 8, 11], 10)); // [2,3]  (4 + 6)
```

3-Sum — all unique triplets summing to 0, O(n²):
```js
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip duplicate anchor
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++; // skip dup left
        while (l < r && nums[r] === nums[r - 1]) r--; // skip dup right
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return res;
}
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
```

Container with most water — O(n):
```js
function maxArea(h) {
  let l = 0, r = h.length - 1, max = 0;
  while (l < r) {
    max = Math.max(max, Math.min(h[l], h[r]) * (r - l));
    if (h[l] < h[r]) l++; else r--; // move the shorter wall — the only way area can grow
  }
  return max;
}
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
```

## Gotchas
- Converging two-pointer **requires sorted input**. If it isn't sorted, either sort first (O(n log n)) or fall back to a hashmap (see [[Hashing]] / two-sum).
- In 3-sum the duplicate-skipping is the part people forget — without it you emit the same triplet many times.
- Container: always move the **shorter** side. Moving the taller side can never increase `min(height) * width`, since width only shrinks.

## Follow-ups
- **"Why move the shorter wall in container-with-water?"** Area is bounded by the shorter wall; keeping it and shrinking width guarantees a smaller-or-equal area, so the only chance to improve is to discard the short wall.
- **"Same-direction two pointers?"** Slow/fast for in-place dedup, removing elements, and Floyd's cycle detection on a linked list (see [[Linked-List]]).

## Related
[[Arrays-Strings]] · [[Sliding-Window]] · [[Hashing]]
