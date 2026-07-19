# DSA — Two Pointers

## Q
Explain the two-pointer pattern. Solve pair sum on sorted array, 3-sum, container with most water.

## A
Two indices move toward each other (or same direction) to shrink search from O(n²) to O(n). Works best on **sorted** arrays or in-place scans.

## Code
Pair sum (sorted) — O(n):
```js
function pairSum(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    const sum = arr[l] + arr[r];
    if (sum === target) return [l, r];
    if (sum < target) l++;   // need bigger
    else r--;                // need smaller
  }
  return [];
}
```

3-Sum (unique triplets = 0):
```js
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip dup
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++; // skip dup
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return res;
}
```

Container with most water:
```js
function maxArea(h) {
  let l = 0, r = h.length - 1, max = 0;
  while (l < r) {
    max = Math.max(max, Math.min(h[l], h[r]) * (r - l));
    if (h[l] < h[r]) l++; else r--; // move shorter side
  }
  return max;
}
```

## How
Sorted order lets you decide which pointer to move by comparing sum vs target. Skip duplicates for unique results.

## Why
Removes inner loop → O(n) or O(n²) for 3-sum (vs O(n³) brute).

## Where / Scenario
Pair/triplet sums, palindrome check, merge sorted, remove duplicates in-place, reverse (see [[Arrays-Strings]]), trapping rain water.

## Related
[[Arrays-Strings]] · [[Sliding-Window]]
