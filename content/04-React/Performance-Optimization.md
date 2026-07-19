# React Performance Optimization

## Q
How do you optimize a slow React app? What causes unnecessary re-renders?

## A
A component re-renders when: its state changes, its parent re-renders, or its context value changes. Optimize by memoizing, splitting, and stabilizing references.

## Code
```jsx
// 1. React.memo - skip re-render if props unchanged (shallow compare)
const Row = React.memo(({ data }) => <div>{data.name}</div>);

// 2. useMemo - cache expensive compute
const total = useMemo(() => items.reduce((a, b) => a + b.price, 0), [items]);

// 3. useCallback - stable fn reference for memoized children
const onClick = useCallback(() => select(id), [id]);

// 4. code splitting / lazy
const Dashboard = React.lazy(() => import("./Dashboard"));
<Suspense fallback={<Spinner />}><Dashboard /></Suspense>

// 5. list virtualization (react-window) for 1000s of rows
```

## Common re-render causes
| Cause | Fix |
|---|---|
| Inline object/array/fn props | `useMemo`/`useCallback` |
| Parent re-render cascades | `React.memo` on child |
| Context changes | split contexts, memo value |
| New object each render | hoist or memoize |
| Big lists | virtualization |

## How to find
- React DevTools Profiler → highlight re-renders.
- `why-did-you-render` lib.

## Why
Fewer/cheaper renders = smoother UI, lower CPU. But **don't premature-optimize** — measure first; memo has its own cost.

## Where / Scenario
- Large tables/feeds.
- Heavy dashboards (charts).
- Forms with many fields.

## Related
[[Hooks]] · [[Reconciliation-VirtualDOM]] · [[Deep-Shallow-Copy]]
