# Reconciliation & Virtual DOM

## Q
How does the virtual DOM work? Explain reconciliation. Why `key` in lists?

## A
Virtual DOM = lightweight JS object tree mirroring real DOM. On state change React builds a new tree, **diffs** it against the old (reconciliation), and patches only the changed real DOM nodes.

## Code
```jsx
// BAD - index key: reorder/insert breaks state, wrong updates
{items.map((item, i) => <Row key={i} data={item} />)}

// GOOD - stable unique id
{items.map((item) => <Row key={item.id} data={item} />)}
```

Why index key breaks:
```
list = [A, B, C]  keys 0,1,2
insert X at front -> [X, A, B, C]
index keys now: X=0(was A), A=1(was B)...
React thinks item 0 changed A->X, reuses A's DOM/state wrongly
stable id keys -> React knows X is new, others just moved
```

## How (diffing heuristics — O(n))
1. Different element type → destroy + rebuild subtree.
2. Same type → keep node, update changed props.
3. Lists → match by `key`. Same key = same element (move, don't recreate).

## Why
Real DOM ops are slow. Batching + minimal diff patches = fast UI. Keys give React identity to reuse nodes and preserve state (input focus, animations).

## Where / Scenario
- Dynamic/reorderable lists, tables.
- Bug: form inputs losing value on list change → index key culprit.
- Fiber (React 16+) makes this interruptible/prioritized.

## Related
[[Performance-Optimization]] · [[Hooks]]
