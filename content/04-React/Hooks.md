# React Hooks

## Q
Explain core hooks. `useEffect` deps/cleanup. `useMemo` vs `useCallback`. Rules of hooks.

## A
Hooks add state/lifecycle to function components. Called **top level only**, same order every render (no conditionals/loops).

## Code
```jsx
// useState
const [count, setCount] = useState(0);
setCount((c) => c + 1);        // functional update (avoids stale value)

// useEffect - run after render
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // CLEANUP: on unmount + before re-run
}, [dep]);                        // deps: [] once, [dep] on change, none=every render

// useRef - mutable box, no re-render
const inputRef = useRef(null);
inputRef.current.focus();

// useMemo - cache VALUE
const sorted = useMemo(() => list.sort(cmp), [list]);

// useCallback - cache FUNCTION reference
const handler = useCallback(() => doThing(id), [id]);

// useContext
const theme = useContext(ThemeContext);

// useReducer - complex state (see React-Coding-Questions)
```

## useEffect deps — the #1 bug source
| Deps | Runs |
|---|---|
| none | after every render |
| `[]` | once (mount) |
| `[a,b]` | when a or b change |
| missing a used var | **stale closure bug** |

## useMemo vs useCallback
- `useMemo(fn, deps)` → caches **return value**.
- `useCallback(fn, deps)` → caches the **function itself**.
- `useCallback(fn, d)` === `useMemo(() => fn, d)`.

## Why
Cleanup prevents leaks (timers, subscriptions, listeners). Memo prevents expensive recompute + unnecessary child re-render (with `React.memo`).

## Where / Scenario
- `useCallback`/`useMemo` — only when passing to memoized children or heavy compute. Don't over-use.
- `useRef` — DOM access, store previous value, mutable flag (avoid setState).

## Related
[[Performance-Optimization]] · [[React-Coding-Questions]] · [[Closures]]
