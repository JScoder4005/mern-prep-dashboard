# DSA — Heap / Priority Queue

## Q
What is a heap? Solve top-K, kth largest, merge K sorted. JS has no built-in heap — implement one.

## A
Heap = complete binary tree kept as array. **Min-heap** root = smallest. O(log n) insert/extract, O(1) peek. Priority queue = heap. JS has none built-in → implement or use array.

## Code
Min-heap:
```js
class MinHeap {
  constructor() { this.h = []; }
  peek() { return this.h[0]; }
  size() { return this.h.length; }

  push(val) {
    this.h.push(val);
    this._up(this.h.length - 1);
  }
  pop() {
    const top = this.h[0];
    const last = this.h.pop();
    if (this.h.length) { this.h[0] = last; this._down(0); }
    return top;
  }
  _up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  _down(i) {
    const n = this.h.length;
    while (true) {
      let smallest = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.h[l] < this.h[smallest]) smallest = l;
      if (r < n && this.h[r] < this.h[smallest]) smallest = r;
      if (smallest === i) break;
      [this.h[smallest], this.h[i]] = [this.h[i], this.h[smallest]];
      i = smallest;
    }
  }
}
```

Kth largest (min-heap of size k):
```js
function kthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop(); // keep k largest, root = kth largest
  }
  return heap.peek();
}
```

Top-K frequent:
```js
function topKFrequent(nums, k) {
  const count = new Map();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1])   // simple: sort (O(n log n))
    .slice(0, k)
    .map((e) => e[0]);
  // optimal: min-heap of size k -> O(n log k)
}
```

## Heap indices (array form)
```
parent(i) = (i-1)/2 floored
left(i)   = 2i+1
right(i)  = 2i+2
```

## How
Push → append + bubble up. Pop → swap root with last, remove, sink down. Tree stays complete → array-backed, no pointers.

## Why
Top/min/max repeatedly without full sort. K-largest in O(n log k) beats sort O(n log n).

## Where / Scenario
Priority queue (Dijkstra — see [[Graphs]]), task scheduling, top-K, median stream (two heaps), merge K sorted lists, event simulation.

## Related
[[Graphs]] · [[Searching-Sorting]]
