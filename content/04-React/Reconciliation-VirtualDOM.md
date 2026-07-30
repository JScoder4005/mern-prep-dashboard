# Reconciliation & Virtual DOM

## Q
How does the virtual DOM work? Explain reconciliation. Why does React need a `key` in lists?

## Answer
The virtual DOM is a lightweight JS object tree that mirrors the real DOM. When state changes, React builds a fresh tree, **diffs** it against the previous one (reconciliation), and applies the minimal set of real-DOM mutations. Direct DOM operations are expensive, so batching the diff and touching only what changed keeps the UI fast. `key` gives each list item a stable identity so React can tell "moved" from "changed" and reuse the right node and its state.

## How it works
React's diff is a set of O(n) heuristics rather than an exact tree-diff (which would be O(n³)): (1) **different element type** → tear down the old subtree and build a new one; (2) **same type** → keep the DOM node, update only the changed props; (3) **lists** → match children by `key` — same key means the same element, so React moves it instead of recreating. Fiber (React 16+) makes this work interruptible and prioritized so long renders don't block input.

## Code
```jsx
// BAD — index key: an insert/reorder shifts every index and mismatches state
{items.map((item, i) => <Row key={i} data={item} />)}

// GOOD — stable unique id survives reordering
{items.map((item) => <Row key={item.id} data={item} />)}
```

Why an index key breaks on insert:
```
list = [A, B, C]   index keys 0,1,2
insert X at front → [X, A, B, C]
index keys now: X=0 (was A), A=1 (was B), ...
React thinks slot 0 changed A→X and reuses A's DOM/state for X — wrong.
Stable id keys → React sees X is new, A/B/C just shifted down.
```

## Gotchas
- **Never use the array index as `key`** for lists that can reorder, insert, or delete — it's the #1 cause of "form input keeps the wrong value after the list changes". Index keys are only safe for static, append-only lists.
- `key` must be **unique among siblings** and **stable across renders** — don't use `Math.random()`, which forces a full remount every render.
- Keys are for React's bookkeeping only; they're not passed to the component as a prop.

## Follow-ups
- **"Is the virtual DOM faster than direct DOM?"** Not inherently — it's a productivity/consistency layer. The win is *batched, minimal* updates plus a declarative model; hand-tuned direct DOM can be faster but is far harder to maintain.
- **"What is Fiber?"** React's reconciler rewrite that splits rendering into interruptible units of work, enabling priorities, time-slicing, and Suspense.
- **"When does React remount vs update?"** Different type or different `key` → remount (state lost); same type + same key → update in place (state preserved).

## Related
[[Performance-Optimization]] · [[Hooks]]
