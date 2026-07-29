# DSA — Dynamic Programming

## Q
What is DP? Solve Fibonacci (memoization + tabulation), coin change, longest increasing subsequence, and 0/1 knapsack.

## Answer
DP solves a problem by breaking it into **overlapping subproblems** and storing each subresult so you never recompute it. Two styles: **memoization** (top-down — natural recursion plus a cache) and **tabulation** (bottom-up — fill a table in dependency order). The tell-tale signals in an interview prompt are "count the ways", "min/max cost", or "can you reach X" — combined with a naive solution that recomputes the same states exponentially.

## How it works
The recipe is always four steps: (1) define the **state** — what `dp[i]` means; (2) write the **recurrence** relating a state to smaller ones; (3) set the **base case**; (4) choose an **evaluation order** — bottom-up tabulation, or top-down memoized recursion. The payoff is turning exponential recomputation into polynomial work: naive Fibonacci is O(2ⁿ) because `fib(n-2)` is recomputed all over the tree; caching makes each state solved once → O(n).

## Code
Fibonacci — memoization (top-down):
```js
function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo));
}
console.log(fib(10)); // 55
```

Fibonacci — tabulation (bottom-up, O(1) space):
```js
function fib(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b]; // roll the window forward
  return b;
}
console.log(fib(10)); // 55
```

Coin change — fewest coins to make `amount`:
```js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // zero coins make amount 0
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
console.log(coinChange([1, 2, 5], 11)); // 3  (5+5+1)
console.log(coinChange([2], 3));        // -1 (impossible)
```

Longest Increasing Subsequence — O(n²):
```js
function lis(nums) {
  const dp = new Array(nums.length).fill(1); // dp[i] = LIS ending at i
  let max = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    max = Math.max(max, dp[i]);
  }
  return max;
}
console.log(lis([10, 9, 2, 5, 3, 7, 101, 18])); // 4  (2,3,7,18 or 2,5,7,101)
```

0/1 Knapsack — max value under a weight cap:
```js
function knapsack(weights, values, cap) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(cap + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= cap; w++) {
      dp[i][w] = dp[i - 1][w];                       // skip item i
      if (weights[i - 1] <= w) {                     // or take it
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  return dp[n][cap];
}
console.log(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7)); // 9  (items w=3 + w=4)
```

## Gotchas
- **Memoization cache key must capture the full state.** If a subproblem depends on two variables, key on both — a 1-D cache silently returns wrong answers.
- Coin change: initialize `dp[0] = 0` and everything else `Infinity`; forgetting the sentinel makes "impossible" indistinguishable from 0.
- 0/1 knapsack must iterate weight **descending** if you flatten to a 1-D array — otherwise you reuse an item more than once (that bug is exactly the *unbounded* knapsack).

## Follow-ups
- **"Memoization vs tabulation trade-offs?"** Top-down only computes states you actually need and reads naturally; bottom-up avoids recursion/stack limits and often enables O(1)-space rolling arrays.
- **"LIS in O(n log n)?"** Patience sorting — binary-search each element into a `tails` array; its length is the LIS.
- **"How do you spot a DP problem?"** Overlapping subproblems + optimal substructure. No overlap → plain divide-and-conquer (e.g. merge sort) instead.

## Related
[[Recursion-Backtracking]] · [[Arrays-Strings]] · [[Searching-Sorting]]
