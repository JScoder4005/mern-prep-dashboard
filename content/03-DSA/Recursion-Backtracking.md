# DSA — Recursion & Backtracking

## Q
Explain recursion + backtracking. Solve subsets, permutations, combinations.

## A
- **Recursion** — function calls itself on smaller input until a **base case**.
- **Backtracking** — try a choice, recurse, then **undo** (backtrack) to explore other branches. Build → recurse → remove.

## Code
Factorial (basic recursion):
```js
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
```

Subsets (power set):
```js
function subsets(nums) {
  const res = [];
  function backtrack(start, path) {
    res.push([...path]);            // record every node
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);           // choose
      backtrack(i + 1, path);       // explore
      path.pop();                   // un-choose (backtrack)
    }
  }
  backtrack(0, []);
  return res;
}
subsets([1, 2, 3]); // [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
```

Permutations:
```js
function permute(nums) {
  const res = [];
  function backtrack(path, used) {
    if (path.length === nums.length) { res.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      backtrack(path, used);
      used[i] = false; path.pop();   // undo
    }
  }
  backtrack([], []);
  return res;
}
```

Combinations (n choose k):
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
```

## How
Template: base case → loop choices → choose → recurse → undo. `[...path]` copies so later mutation doesn't corrupt stored result.

## Why
Explores decision tree exhaustively. Backtracking prunes invalid paths early.

## Where / Scenario
Subsets/permutations/combinations, N-queens, sudoku, word search, generate parentheses, path finding.

## Related
[[Trees]] · [[Dynamic-Programming]] · [[Stack-Queue]]
