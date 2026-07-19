# DSA — Searching & Sorting

## Q
Binary search + variants. Implement quicksort/mergesort. Complexity of sorts.

## A
- **Binary search** — O(log n) on **sorted** array. Halve range each step.
- Know merge sort (O(n log n) stable) + quick sort (avg O(n log n)).

## Code
Binary search:
```js
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2); // avoid overflow
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

First/last occurrence (variant):
```js
function firstOccurrence(arr, t) {
  let lo = 0, hi = arr.length - 1, res = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === t) { res = mid; hi = mid - 1; } // keep searching left
    else if (arr[mid] < t) lo = mid + 1;
    else hi = mid - 1;
  }
  return res;
}
```

Search rotated sorted array:
```js
function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {              // left half sorted
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                  // right half sorted
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
```

Merge sort:
```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const l = mergeSort(arr.slice(0, mid));
  const r = mergeSort(arr.slice(mid));
  const res = [];
  let i = 0, j = 0;
  while (i < l.length && j < r.length)
    res.push(l[i] <= r[j] ? l[i++] : r[j++]);
  return [...res, ...l.slice(i), ...r.slice(j)];
}
```

Quicksort:
```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.filter((x, i) => x < pivot && i < arr.length - 1);
  const right = arr.filter((x, i) => x >= pivot && i < arr.length - 1);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

## Complexity table
| Sort | Avg | Worst | Space | Stable |
|---|---|---|---|---|
| Merge | n log n | n log n | O(n) | ✅ |
| Quick | n log n | n² | O(log n) | ❌ |
| Heap | n log n | n log n | O(1) | ❌ |
| Bubble/Insertion | n² | n² | O(1) | ✅ |

**JS note:** `arr.sort((a,b)=>a-b)` — must pass comparator for numbers (default is lexicographic).

## How
Binary search discards half each step (log n). Divide-and-conquer for merge/quick.

## Why
Sorted data → log-time search. Foundation for many optimizations (two-pointer needs sort).

## Where / Scenario
Search in sorted DB indexes, autocomplete, find boundaries (first/last), rotated arrays, dedup after sort.

## Related
[[Two-Pointers]] · [[Trees]]
