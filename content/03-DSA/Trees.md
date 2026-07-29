# DSA — Trees

## Q
Tree traversals (DFS variants + BFS level order), max depth, validate a BST, and lowest common ancestor.

## Answer
A tree is a set of nodes with parent→child links and no cycles; a **binary tree** has at most two children per node. **DFS** goes deep first — recursion (or an explicit stack) gives you the three orders: **inorder** (left, root, right — sorted for a BST), **preorder** (root first), **postorder** (root last). **BFS** uses a queue to visit level by level. A **BST** adds the invariant "left subtree < node < right subtree", which makes search, validation, and LCA O(height).

> Demos below inline `TreeNode` and build a small BST so each block runs standalone:
> ```
>        4
>       / \
>      2   6
>     / \ / \
>    1  3 5  7
> ```

## How it works
Recursion is just an implicit stack: each call handles one node and delegates its children. BFS keeps a queue and processes it one level at a time by snapshotting the queue length before draining it. For BST-specific problems you exploit the ordering — validate by carrying a `(min, max)` range down each path; find LCA by walking down until the two targets split to different sides.

## Code
The node type + a sample tree helper:
```js
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}
const n = (v, l = null, r = null) => new TreeNode(v, l, r);
const tree = n(4, n(2, n(1), n(3)), n(6, n(5), n(7)));
console.log(tree.val, tree.left.val, tree.right.val); // 4 2 6
```

DFS inorder (left, root, right → sorted for a BST):
```js
class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const n = (v, l = null, r = null) => new TreeNode(v, l, r);
const tree = n(4, n(2, n(1), n(3)), n(6, n(5), n(7)));

function inorder(node, res = []) {
  if (!node) return res;
  inorder(node.left, res);
  res.push(node.val);
  inorder(node.right, res);
  return res;
}
console.log(inorder(tree)); // [1,2,3,4,5,6,7]
// preorder = root,left,right | postorder = left,right,root
```

BFS level order (queue):
```js
class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const n = (v, l = null, r = null) => new TreeNode(v, l, r);
const tree = n(4, n(2, n(1), n(3)), n(6, n(5), n(7)));

function levelOrder(root) {
  if (!root) return [];
  const res = [], queue = [root];
  while (queue.length) {
    const level = [], size = queue.length; // snapshot: only this level
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
console.log(levelOrder(tree)); // [[4],[2,6],[1,3,5,7]]
```

Max depth:
```js
class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const n = (v, l = null, r = null) => new TreeNode(v, l, r);
const tree = n(4, n(2, n(1), n(3)), n(6, n(5), n(7)));

const maxDepth = (t) => (!t ? 0 : 1 + Math.max(maxDepth(t.left), maxDepth(t.right)));
console.log(maxDepth(tree)); // 3
```

Validate BST (carry a valid range down each path):
```js
class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const n = (v, l = null, r = null) => new TreeNode(v, l, r);

function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false;
  return isValidBST(node.left, min, node.val) &&
         isValidBST(node.right, node.val, max);
}
const good = n(4, n(2, n(1), n(3)), n(6, n(5), n(7)));
const bad  = n(4, n(2, n(1), n(5)), n(6)); // 5 sits left of 4 — invalid
console.log(isValidBST(good), isValidBST(bad)); // true false
```

Lowest Common Ancestor in a BST (walk down to the split point):
```js
class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const n = (v, l = null, r = null) => new TreeNode(v, l, r);
const tree = n(4, n(2, n(1), n(3)), n(6, n(5), n(7)));

function lca(root, p, q) {
  if (p.val < root.val && q.val < root.val) return lca(root.left, p, q);
  if (p.val > root.val && q.val > root.val) return lca(root.right, p, q);
  return root; // p and q diverge here → this is the LCA
}
console.log(lca(tree, { val: 1 }, { val: 3 }).val); // 2
console.log(lca(tree, { val: 1 }, { val: 7 }).val); // 4
```

## Gotchas
- **Validate BST needs a range, not a local parent check** — comparing only against the immediate parent passes trees where a deep node violates an ancestor bound (the `bad` tree above).
- BFS must snapshot `queue.length` before the inner loop, or you'll pull nodes from the next level into the current one.
- `Array.shift()` for the BFS queue is O(n); fine for interviews but use a head-index pointer for large trees.

## Follow-ups
- **"LCA in a plain (non-BST) binary tree?"** No ordering to exploit — recurse both sides; the node where p and q are found in different subtrees is the LCA.
- **"Iterative inorder?"** Push lefts onto an explicit stack, pop-visit-go-right — the same traversal without recursion.

## Related
[[Stack-Queue]] · [[Recursion-Backtracking]] · [[Graphs]]
