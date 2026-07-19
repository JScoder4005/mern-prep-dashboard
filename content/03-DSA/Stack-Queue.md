# DSA — Stack & Queue

## Q
Stack vs queue? Solve valid parentheses, next greater element, implement queue with stacks.

## A
- **Stack** — LIFO (last in first out). `push`/`pop` at end. JS array `push`/`pop`.
- **Queue** — FIFO (first in first out). Enqueue back, dequeue front. Use array or two stacks.

## Code
Valid parentheses:
```js
function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const c of s) {
    if (c === "(" || c === "[" || c === "{") stack.push(c);
    else {
      if (stack.pop() !== pairs[c]) return false; // mismatch or empty
    }
  }
  return stack.length === 0;
}
isValid("({[]})"); // true
```

Next greater element (monotonic stack) — O(n):
```js
function nextGreater(nums) {
  const res = new Array(nums.length).fill(-1);
  const stack = []; // holds indices, decreasing values
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      res[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return res;
}
```

Queue using two stacks:
```js
class MyQueue {
  constructor() { this.in = []; this.out = []; }
  enqueue(x) { this.in.push(x); }
  dequeue() {
    if (!this.out.length) while (this.in.length) this.out.push(this.in.pop());
    return this.out.pop();
  }
}
```

## How
Stack tracks "unmatched/pending" items. Monotonic stack keeps candidates until a bigger element resolves them.

## Why
O(n) for problems that look O(n²). Natural for nesting/matching and order reversal.

## Where / Scenario
- Stack — bracket matching, undo/redo, DFS, expression eval, browser history, call stack, next-greater/temperature.
- Queue — BFS, task scheduling, rate limiting, print jobs, message buffers.

## Related
[[Trees]] · [[Recursion-Backtracking]]
