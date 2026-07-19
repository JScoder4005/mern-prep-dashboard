# DSA — Linked List

## Q
Reverse a linked list, detect a cycle, find middle, merge two sorted lists.

## A
Linked list = nodes each holding `val` + `next` pointer. No index access; traverse from head. Pointer manipulation is the whole game.

## Code
Node:
```js
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}
```

Reverse (iterative) — O(n) time O(1) space:
```js
function reverse(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next; // save
    curr.next = prev;       // flip pointer
    prev = curr;            // advance
    curr = next;
  }
  return prev;              // new head
}
```

Reverse (recursive):
```js
function reverseRec(head) {
  if (!head || !head.next) return head;
  const newHead = reverseRec(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

Detect cycle (Floyd's fast/slow):
```js
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;        // +1
    fast = fast.next.next;   // +2
    if (slow === fast) return true; // meet => cycle
  }
  return false;
}
```

Find middle (fast/slow):
```js
function middle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow; // fast at end => slow at middle
}
```

Merge two sorted lists:
```js
function merge(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b; // attach rest
  return dummy.next;
}
```

## How
Three-pointer dance for reverse. Fast/slow (tortoise-hare) for cycle/middle. Dummy head simplifies edge cases.

## Why
O(1) insert/delete at known node (vs array shift O(n)). No random access though.

## Where / Scenario
LRU cache (doubly linked + map), undo history, adjacency lists, stream processing, reverse/merge classics.

## Related
[[Two-Pointers]] · [[Recursion-Backtracking]]
