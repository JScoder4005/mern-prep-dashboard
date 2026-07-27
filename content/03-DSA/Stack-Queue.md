# DSA — Stack & Queue

## Q
Stack vs queue? Solve valid parentheses and next-greater-element, and implement a queue using two stacks.

## Answer
A **stack** is LIFO (last in, first out) — you only touch the top; a JS array's `push`/`pop` is a stack. A **queue** is FIFO (first in, first out) — add at the back, remove from the front. Stacks shine on nesting/matching and "most recent" problems; queues drive level-by-level processing like BFS. The classic trick problems are bracket matching (stack), monotonic stack (next-greater), and building a queue from two stacks.

## How it works
A stack naturally tracks "pending / unmatched" work — the top is always the most recent thing still open. A **monotonic stack** keeps candidates in sorted order and resolves them the moment a qualifying element arrives, so each item is pushed and popped once → O(n). A queue from two stacks amortizes to O(1) by only reversing the "in" stack into the "out" stack when the out stack runs dry.

## Code
Valid parentheses:
```js
function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const c of s) {
    if (c === "(" || c === "[" || c === "{") stack.push(c);
    else if (stack.pop() !== pairs[c]) return false; // mismatch or empty
  }
  return stack.length === 0; // leftover opens = invalid
}
console.log(isValid("({[]})"), isValid("(]"), isValid("(")); // true false false
```

Next greater element (monotonic stack) — O(n):
```js
function nextGreater(nums) {
  const res = new Array(nums.length).fill(-1);
  const stack = []; // holds indices, values decreasing bottom→top
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      res[stack.pop()] = nums[i]; // current resolves everything smaller
    }
    stack.push(i);
  }
  return res;
}
console.log(nextGreater([2, 1, 2, 4, 3])); // [4,2,4,-1,-1]
```

Queue using two stacks (amortized O(1) dequeue):
```js
class MyQueue {
  constructor() { this.in = []; this.out = []; }
  enqueue(x) { this.in.push(x); }
  dequeue() {
    if (!this.out.length) while (this.in.length) this.out.push(this.in.pop());
    return this.out.pop();
  }
}
const q = new MyQueue();
q.enqueue(1); q.enqueue(2); q.enqueue(3);
console.log(q.dequeue(), q.dequeue(), q.dequeue()); // 1 2 3 (FIFO)
```

## Gotchas
- `stack.pop()` on an empty array returns `undefined` — the parentheses check leans on that (a closing bracket with nothing to match fails), but always confirm the stack is empty at the end too.
- **Don't use `Array.shift()` for a queue** in a hot loop — it's O(n) because it re-indexes every element. Use two stacks, a circular buffer, or a head-index pointer for O(1).
- Monotonic stack stores **indices**, not values, so you can write results back into the right position.

## Follow-ups
- **"Why is the two-stack queue O(1) amortized?"** Each element is moved from `in` to `out` at most once, so N dequeues do at most N transfers total — O(1) each on average.
- **"Daily temperatures / stock span?"** Same monotonic-stack template — store indices, pop while the incoming value beats the top.

## Related
[[Trees]] · [[Recursion-Backtracking]] · [[Arrays-Strings]]
