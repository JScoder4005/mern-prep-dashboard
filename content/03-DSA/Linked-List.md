# DSA — Linked List

## Q
Reverse a linked list, detect a cycle, find the middle, and merge two sorted lists.

## Answer
A linked list is a chain of nodes, each holding a `val` and a `next` pointer. There's no index access — you traverse from the head — so every problem is really about **pointer manipulation**. The two workhorse techniques are the **three-pointer reversal** (prev/curr/next) and the **fast/slow pair** (tortoise-and-hare) for cycle detection and finding the middle. A **dummy head** node kills most edge cases in build/merge problems.

> Each demo below defines `ListNode` plus tiny `fromArray`/`toArray` helpers inline so it runs standalone (inline Run executes each block in isolation).

## How it works
Reversal walks the list once, flipping each `next` to point backward while stashing the next node first so you don't lose the rest of the chain — O(n) time, O(1) space. Fast/slow moves one pointer at +1 and another at +2: if there's a cycle they must eventually collide; when fast reaches the end, slow sits at the middle. A dummy head gives you a stable node to append to so you never special-case the empty result.

## Code
The node type + a round-trip sanity check:
```js
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);
const toArray = (h) => { const o = []; while (h) { o.push(h.val); h = h.next; } return o; };
console.log(toArray(fromArray([1, 2, 3]))); // [1,2,3]
```

Reverse (iterative) — O(n) time, O(1) space:
```js
class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);
const toArray = (h) => { const o = []; while (h) { o.push(h.val); h = h.next; } return o; };

function reverse(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next; // save the rest
    curr.next = prev;       // flip pointer backward
    prev = curr;            // advance prev
    curr = next;            // advance curr
  }
  return prev;              // new head
}
console.log(toArray(reverse(fromArray([1, 2, 3, 4, 5])))); // [5,4,3,2,1]
```

Reverse (recursive):
```js
class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);
const toArray = (h) => { const o = []; while (h) { o.push(h.val); h = h.next; } return o; };

function reverseRec(head) {
  if (!head || !head.next) return head; // base: empty or single node
  const newHead = reverseRec(head.next);
  head.next.next = head; // the node ahead now points back at us
  head.next = null;      // and we become the tail
  return newHead;
}
console.log(toArray(reverseRec(fromArray([1, 2, 3, 4, 5])))); // [5,4,3,2,1]
```

Detect cycle (Floyd's fast/slow):
```js
class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }

function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;        // +1
    fast = fast.next.next;   // +2
    if (slow === fast) return true; // they meet ⇒ cycle
  }
  return false;
}
const a = new ListNode(1), b = new ListNode(2), c = new ListNode(3);
a.next = b; b.next = c;                 // 1→2→3→null
console.log(hasCycle(a));               // false
c.next = a;                             // make it loop: 3→1
console.log(hasCycle(a));               // true
```

Find middle (fast/slow):
```js
class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);

function middle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow; // fast hits the end ⇒ slow is at the middle
}
console.log(middle(fromArray([1, 2, 3, 4, 5])).val); // 3
console.log(middle(fromArray([1, 2, 3, 4])).val);    // 3 (second of the two middles)
```

Merge two sorted lists (dummy head):
```js
class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);
const toArray = (h) => { const o = []; while (h) { o.push(h.val); h = h.next; } return o; };

function merge(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b; // attach whatever remains (already sorted)
  return dummy.next;
}
console.log(toArray(merge(fromArray([1, 3, 5]), fromArray([2, 4, 6])))); // [1,2,3,4,5,6]
```

## Gotchas
- In iterative reverse you **must** save `curr.next` before overwriting it — flip the pointer first and you lose the rest of the list.
- Fast/slow needs the `fast && fast.next` guard; skip it and you dereference `null.next` at the end.
- Cycle detection with a `Set` of visited nodes also works but costs O(n) space — Floyd's is O(1).

## Follow-ups
- **"Find the cycle's start node?"** After they meet, reset one pointer to the head and advance both by 1; they meet again exactly at the cycle entrance (Floyd's phase 2).
- **"Why a dummy head?"** It removes the "is this the first node?" special case, so `tail.next = ...` always works.
- **"LRU cache?"** Doubly linked list (O(1) move-to-front / evict tail) plus a hashmap (O(1) lookup).

## Related
[[Two-Pointers]] · [[Recursion-Backtracking]] · [[Hashing]]
