# DSA — Trees & Graphs

## Q
Tree traversals (BFS/DFS), level order, max depth, LCA, validate BST.

## A
Tree = nodes with children, no cycles. Binary tree ≤2 children. **DFS** (stack/recursion) = inorder/preorder/postorder. **BFS** (queue) = level by level.

## Code
Node:
```js
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}
```

DFS traversals (recursive):
```js
function inorder(node, res = []) {   // left, root, right (sorted for BST)
  if (!node) return res;
  inorder(node.left, res);
  res.push(node.val);
  inorder(node.right, res);
  return res;
}
// preorder: root,left,right | postorder: left,right,root
```

BFS level order (queue):
```js
function levelOrder(root) {
  if (!root) return [];
  const res = [], queue = [root];
  while (queue.length) {
    const level = [], size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}
```

Max depth:
```js
const maxDepth = (n) => (!n ? 0 : 1 + Math.max(maxDepth(n.left), maxDepth(n.right)));
```

Validate BST:
```js
function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false;
  return isValidBST(node.left, min, node.val) &&
         isValidBST(node.right, node.val, max);
}
```

Lowest Common Ancestor (BST):
```js
function lca(root, p, q) {
  if (p.val < root.val && q.val < root.val) return lca(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lca(root.right, p, q);
  return root; // split point
}
```

Graph BFS (shortest path unweighted):
```js
function bfs(graph, start) {
  const visited = new Set([start]), queue = [start], order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const nb of graph[node]) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
  }
  return order;
}
```

## How
Recursion = implicit stack for DFS. Explicit queue for BFS. Track `visited` in graphs to avoid cycles.

## Why
DFS for path/depth/exists. BFS for shortest path / level grouping.

## Where / Scenario
File systems, DOM tree, org charts, routing, dependency graphs, autocomplete (trie), social networks.

## Related
[[Stack-Queue]] · [[Recursion-Backtracking]]
