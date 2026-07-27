# DSA — Recursion & Backtracking

## Q
Explain recursion and backtracking. Solve subsets, permutations, and combinations.

## Answer
**Recursion** is a function calling itself on a smaller input until it hits a **base case** that returns without recursing. **Backtracking** is recursion over a decision tree: you make a choice, recurse to explore what follows, then **undo** the choice so you can try the next branch — "choose → explore → un-choose". Almost every "generate all …" problem (subsets, permutations, combinations, N-queens, sudoku) is the same backtracking skeleton with a different choice set and base case.

## How it works
The recursion walks a tree of partial solutions held in one shared `path` array. On the way down you push a choice; on the way back up you pop it, so the same array is reused across the whole tree (O(depth) space instead of copying at every node). When you record a result you copy it (`[...path]`) — otherwise the later `pop()`s would mutate what you stored. `start`/`used` bookkeeping controls which choices are still legal, which is what distinguishes subsets vs combinations vs permutations.

## Code
Factorial — the simplest recursion (base case `n <= 1`):
```js
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
console.log(fact(5)); // 120
```

Subsets (power set) — record at every node:
```js
function subsets(nums) {
  const res = [];
  function backtrack(start, path) {
    res.push([...path]);            // every node is a valid subset
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);           // choose
      backtrack(i + 1, path);       // explore
      path.pop();                   // un-choose (backtrack)
    }
  }
  backtrack(0, []);
  return res;
}
console.log(subsets([1, 2, 3]));
// [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
```

Permutations — order matters, track `used`:
```js
function permute(nums) {
  const res = [];
  function backtrack(path, used) {
    if (path.length === nums.length) { res.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      backtrack(path, used);
      used[i] = false; path.pop();   // undo both
    }
  }
  backtrack([], []);
  return res;
}
console.log(permute([1, 2, 3]));
// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

Combinations (n choose k) — record only at depth k:
```js
function combine(n, k) {
  const res = [];
  function backtrack(start, path) {
    if (path.length === k) { res.push([...path]); return; }
    for (let i = start; i <= n; i++) {
      path.push(i);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(1, []);
  return res;
}
console.log(combine(4, 2)); // [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
```

## Gotchas
- **Copy the result** (`[...path]`) when you store it — pushing the live `path` stores a reference that later `pop()`s empty out.
- Every push must have a matching pop on the way back, and `used[i]` must be reset too — a missed undo corrupts sibling branches.
- Deep recursion can overflow the call stack (JS has no tail-call optimization in practice) — convert to an explicit stack for very deep trees.

## Follow-ups
- **"Subsets vs combinations vs permutations?"** Subsets record at every node; combinations record at fixed depth k with a `start` cursor (no revisiting); permutations allow any unused index each level.
- **"How do you prune?"** Skip choices that can't lead to a valid solution (e.g. sorted array + `if (i > start && nums[i] === nums[i-1]) continue` to dedup) — that's the "backtracking prunes early" advantage over brute force.

## Related
[[Trees]] · [[Dynamic-Programming]] · [[Stack-Queue]]
