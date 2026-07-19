# DSA — Dynamic Programming

## Q
What is DP? Solve fib (memo + tabulation), coin change, LIS, 0/1 knapsack.

## A
DP = break problem into overlapping subproblems, store results (no recompute). Two styles: **memoization** (top-down recursion + cache) and **tabulation** (bottom-up table). Signal: "count ways", "min/max", "can you reach".

## Code
Fibonacci — memoization:
```js
function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo));
}
```

Fibonacci — tabulation:
```js
function fib(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b]; // O(1) space
  return b;
}
```

Coin change (min coins for amount):
```js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

Longest Increasing Subsequence — O(n²):
```js
function lis(nums) {
  const dp = new Array(nums.length).fill(1);
  let max = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    max = Math.max(max, dp[i]);
  }
  return max;
}
```

0/1 Knapsack:
```js
function knapsack(weights, values, cap) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(cap + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= cap; w++) {
      dp[i][w] = dp[i - 1][w];                       // skip item
      if (weights[i - 1] <= w) {                     // take item
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  return dp[n][cap];
}
```

## How
1. Define state (what does dp[i] mean).
2. Recurrence (relate to smaller states).
3. Base case.
4. Order (bottom-up) or memo (top-down).

## Why
Avoids exponential recomputation. Naive fib O(2^n) → DP O(n).

## Where / Scenario
Fewest steps/coins, count paths, edit distance, subset sum, stock profit, string matching, resource allocation.

## Related
[[Recursion-Backtracking]] · [[Arrays-Strings]]
