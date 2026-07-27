# DSA — Searching & Sorting

## Q
Binary search and its variants. Implement merge sort and quicksort. Know the complexity of each sort.

## Answer
**Binary search** is O(log n) on a **sorted** array — compare the middle, then throw away half the range each step. The two sorts you must be able to write are **merge sort** (divide in half, sort each, merge — O(n log n) guaranteed, stable, O(n) space) and **quicksort** (partition around a pivot, recurse — O(n log n) average but O(n²) worst on bad pivots, in-place-ish). The variants that trip people up are "first/last occurrence" and "search in a rotated sorted array", which are binary search with a tweaked decision.

## How it works
Binary search maintains a `[lo, hi]` window and halves it every iteration by comparing against `arr[mid]`. Merge sort is bottom-up correctness: two sorted halves merge in linear time. Quicksort's speed hinges on pivot quality — a median-ish pivot splits evenly (log depth); an already-sorted array with a last-element pivot degrades to O(n²).

## Code
Binary search:
```js
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2); // avoids (lo+hi) overflow
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
console.log(binarySearch([1, 3, 5, 7, 9, 11], 7)); // 3
console.log(binarySearch([1, 3, 5, 7, 9, 11], 8)); // -1
```

First occurrence (keep searching left after a hit):
```js
function firstOccurrence(arr, t) {
  let lo = 0, hi = arr.length - 1, res = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === t) { res = mid; hi = mid - 1; } // found — but look further left
    else if (arr[mid] < t) lo = mid + 1;
    else hi = mid - 1;
  }
  return res;
}
console.log(firstOccurrence([1, 2, 2, 2, 3], 2)); // 1
```

Search in a rotated sorted array:
```js
function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {              // left half is sorted
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                  // right half is sorted
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)); // -1
```

Merge sort — O(n log n), stable:
```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const l = mergeSort(arr.slice(0, mid));
  const r = mergeSort(arr.slice(mid));
  const res = [];
  let i = 0, j = 0;
  while (i < l.length && j < r.length)
    res.push(l[i] <= r[j] ? l[i++] : r[j++]); // <= keeps it stable
  return [...res, ...l.slice(i), ...r.slice(j)];
}
console.log(mergeSort([5, 2, 9, 1, 5, 6])); // [1,2,5,5,6,9]
```

Quicksort (simple, extra-array version):
```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.filter((x, i) => x < pivot && i < arr.length - 1);
  const right = arr.filter((x, i) => x >= pivot && i < arr.length - 1);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
console.log(quickSort([5, 2, 9, 1, 5, 6])); // [1,2,5,5,6,9]
```

## Complexity table
| Sort | Avg | Worst | Space | Stable |
|---|---|---|---|---|
| Merge | n log n | n log n | O(n) | ✅ |
| Quick | n log n | n² | O(log n) | ❌ |
| Heap | n log n | n log n | O(1) | ❌ |
| Bubble / Insertion | n² | n² | O(1) | ✅ |

## Gotchas
- **JS `.sort()` is lexicographic by default** — `[10, 2, 1].sort()` gives `[1, 10, 2]`. Always pass a comparator for numbers: `.sort((a, b) => a - b)`.
- Use `lo + (hi - lo) / 2` (or `(lo + hi) >> 1` when values fit in 31 bits) — `(lo + hi)` can overflow in languages with fixed ints; it's a habit interviewers check for.
- Loop condition `lo <= hi` (not `<`) — with `<` you miss the single-element window and fail to find edge targets.

## Follow-ups
- **"Why is merge sort preferred for linked lists / external sort?"** No random access needed and it's stable; quicksort relies on O(1) index swaps.
- **"When does quicksort hit O(n²)?"** Consistently bad pivots (e.g. already-sorted input with a first/last pivot). Randomized or median-of-three pivots fix it in practice.

## Related
[[Two-Pointers]] · [[Trees]] · [[Heap-Priority-Queue]]
