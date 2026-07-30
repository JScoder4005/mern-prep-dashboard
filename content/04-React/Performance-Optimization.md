# React Performance Optimization

## Q
How do you optimize a slow React app? What causes unnecessary re-renders?

## Answer
A component re-renders when its **own state changes**, its **parent re-renders**, or a **context value it consumes changes** — so most "slow app" problems are wasted renders and expensive work on the render path. The toolkit is: memoize (`React.memo`, `useMemo`, `useCallback`) to skip work, stabilize prop references so memoized children actually skip, split code (`lazy` + `Suspense`) to shrink bundles, and virtualize long lists. But the first move is always to **measure** — the Profiler tells you where the time actually goes; memoization has its own cost and premature use just adds noise.

## How it works
`React.memo` wraps a component in a shallow props comparison — it re-renders only if a prop reference changed, which is why passing a fresh inline `{}`/`[]`/`() => {}` every render defeats it. `useMemo`/`useCallback` cache a value/function across renders keyed by their deps, giving memoized children stable references. Virtualization (react-window) renders only the rows currently in the viewport, so a 10k-row list mounts ~20 DOM nodes instead of 10k.

## Code
```jsx
// 1. React.memo — skip re-render when props are shallow-equal
const Row = React.memo(({ data }) => <div>{data.name}</div>);

// 2. useMemo — cache an expensive computation
const total = useMemo(() => items.reduce((a, b) => a + b.price, 0), [items]);

// 3. useCallback — stable fn reference so a memoized child can skip
const onClick = useCallback(() => select(id), [id]);

// 4. code splitting / lazy load below-the-fold or route-level chunks
const Dashboard = React.lazy(() => import("./Dashboard"));
<Suspense fallback={<Spinner />}><Dashboard /></Suspense>

// 5. list virtualization (react-window) for thousands of rows
```

## Common re-render causes
| Cause | Fix |
|---|---|
| Inline object/array/fn props | `useMemo` / `useCallback` |
| Parent re-render cascades to children | `React.memo` on the child |
| Context value changes | split contexts, memoize the value |
| New object identity each render | hoist out or memoize |
| Very long lists | virtualization |

## How to find it
- **React DevTools Profiler** → record an interaction, see which components rendered and why.
- `why-did-you-render` to log avoidable re-renders in dev.

## Gotchas
- **`React.memo` is useless if you hand it unstable props** — an inline arrow or object is a new reference every render, so the shallow compare always fails. Stabilize with `useCallback`/`useMemo` first.
- Memoizing everything can be net-negative: each `useMemo` stores a value and runs a deps comparison. Reserve it for expensive compute or memoized-child boundaries.
- Context is all-or-nothing — every consumer re-renders when the value changes. Split a high-frequency slice into its own context or move to a selector-based store.

## Follow-ups
- **"React.memo vs useMemo?"** `React.memo` memoizes a *component's render*; `useMemo` memoizes a *value* inside a component.
- **"Does `useMemo` guarantee caching?"** No — React may discard memo caches (e.g. under memory pressure); treat it as an optimization, never for correctness.
- **"How does the React Compiler change this?"** It auto-memoizes at build time, reducing the need for manual `useMemo`/`useCallback` — but understanding the model still matters.

## Where / Scenario
Large tables and feeds, chart-heavy dashboards, forms with many fields.

## Related
[[Hooks]] · [[Reconciliation-VirtualDOM]] · [[Deep-Shallow-Copy]]
