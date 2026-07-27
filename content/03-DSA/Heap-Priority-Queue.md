# DSA — Heap / Priority Queue

## Q
What is a heap? Solve kth-largest and top-K-frequent. JS has no built-in heap — implement one.

## Answer
A heap is a **complete binary tree stored as a flat array**, kept partially ordered: in a **min-heap** every parent is ≤ its children, so the smallest element is always at the root. That buys O(log n) insert and extract-min and O(1) peek — exactly what a **priority queue** needs. JS ships no heap, so interviewers expect you to implement one (bubble-up on insert, sink-down on extract) or fake a small one with a sorted array.

## How it works
Because the tree is complete, you don't need node pointers — array index math gives the family: `parent(i) = (i-1)>>1`, `left = 2i+1`, `right = 2i+2`. **Push** appends to the end and bubbles up while it's smaller than its parent. **Pop** swaps the root with the last element, removes it, then sinks the new root down past its smaller child. Each operation touches one root-to-leaf path → O(log n).

## Code
Min-heap (array-backed):
```js
class MinHeap {
  constructor() { this.h = []; }
  peek() { return this.h[0]; }
  size() { return this.h.length; }
  push(val) { this.h.push(val); this._up(this.h.length - 1); }
  pop() {
    const top = this.h[0];
    const last = this.h.pop();
    if (this.h.length) { this.h[0] = last; this._down(0); }
    return top;
  }
  _up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break; // parent already smaller — done
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
const heap = new MinHeap();
[5, 1, 8, 3, 2].forEach((x) => heap.push(x));
const out = [];
while (heap.size()) out.push(heap.pop());
console.log(out); // [1,2,3,5,8] — pops in sorted order
```

Kth largest (min-heap of size k — root is the answer):
```js
class MinHeap {
  constructor() { this.h = []; }
  peek() { return this.h[0]; }
  size() { return this.h.length; }
  push(v) { this.h.push(v); let i = this.h.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p; } }
  pop() { const top = this.h[0], last = this.h.pop();
    if (this.h.length) { this.h[0] = last; let i = 0, n = this.h.length;
      while (true) { let s = i, l = 2*i+1, r = 2*i+2;
        if (l < n && this.h[l] < this.h[s]) s = l;
        if (r < n && this.h[r] < this.h[s]) s = r;
        if (s === i) break; [this.h[s], this.h[i]] = [this.h[i], this.h[s]]; i = s; } }
    return top; }
}
function kthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop(); // keep only the k largest; root = kth largest
  }
  return heap.peek();
}
console.log(kthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
```

Top-K frequent (sort version; heap version noted):
```js
function topKFrequent(nums, k) {
  const count = new Map();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1])   // simple: full sort, O(n log n)
    .slice(0, k)
    .map((e) => e[0]);
  // optimal: min-heap of size k → O(n log k)
}
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1,2]
```

## Heap indices (array form)
```
parent(i) = (i - 1) >> 1
left(i)   = 2i + 1
right(i)  = 2i + 2
```

## Gotchas
- **Kth largest uses a MIN-heap of size k**, not a max-heap — the smallest of the k largest sits at the root, so anything smaller gets evicted. (Kth *smallest* → max-heap of size k.)
- Building a heap by pushing n items is O(n log n); the bottom-up "heapify" builds in O(n) if you have all data up front.
- Don't confuse a heap (the data structure) with the memory heap — same word, unrelated.

## Follow-ups
- **"Median of a data stream?"** Two heaps — a max-heap for the lower half, a min-heap for the upper — rebalanced so their sizes differ by ≤ 1; median is a root (or the average of both roots).
- **"Where do priority queues show up?"** Dijkstra's shortest path (see [[Graphs]]), A*, task scheduling, merge-K-sorted-lists, event simulation.

## Related
[[Graphs]] · [[Searching-Sorting]] · [[Recursion-Backtracking]]
