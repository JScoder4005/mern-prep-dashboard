# React Hooks

## Q
Explain the core hooks. How do `useEffect` dependencies and cleanup work? `useMemo` vs `useCallback`. What are the rules of hooks?

## Answer
Hooks let function components hold state and tap into lifecycle/side-effects without classes. The rule that makes them work: call them **only at the top level, in the same order every render** — never inside conditionals, loops, or nested functions — because React tracks each hook by call order, not by name. The everyday set is `useState` (local state), `useEffect` (side effects + cleanup), `useRef` (a mutable box that doesn't trigger re-render), `useMemo`/`useCallback` (caching), `useContext` (read a provider), and `useReducer` (state via a reducer).

## How it works
React keeps a per-component list of hook "slots" and walks it in order on every render — that's why the order must be stable. `useState`'s setter schedules a re-render; use the **functional form** `setCount(c => c + 1)` when the next value depends on the previous to avoid stale reads. `useEffect` runs *after* paint; its dependency array decides when it re-runs, and the function you return is the **cleanup**, invoked before the next run and on unmount.

## Code
```jsx
// useState — functional update avoids stale values
const [count, setCount] = useState(0);
setCount((c) => c + 1);

// useEffect — runs after render; return a cleanup
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // cleanup: on unmount + before each re-run
}, [dep]);                        // [] = once, [dep] = on change, omitted = every render

// useRef — mutable box, no re-render on change
const inputRef = useRef(null);
inputRef.current?.focus();

// useMemo — cache a VALUE
const sorted = useMemo(() => [...list].sort(cmp), [list]);

// useCallback — cache a FUNCTION reference
const handler = useCallback(() => doThing(id), [id]);

// useContext — read the nearest provider's value
const theme = useContext(ThemeContext);
```

## useEffect deps — the #1 bug source
| Deps | Runs |
|---|---|
| omitted | after every render |
| `[]` | once (on mount) |
| `[a, b]` | when `a` or `b` change |
| a used var left out | **stale-closure bug** |

## useMemo vs useCallback
- `useMemo(fn, deps)` caches the **return value** of `fn`.
- `useCallback(fn, deps)` caches the **function itself** (a stable reference).
- Identity: `useCallback(fn, d)` ≡ `useMemo(() => fn, d)`.

## Gotchas
- **Stale closures:** an effect/callback captures the variables from the render it was created in. Leave a used value out of the deps and it keeps reading the old one — the classic `setInterval` reading a frozen `count`. Fix with the functional updater or by listing the dep.
- **Don't over-memoize.** `useMemo`/`useCallback` cost memory + comparison; they only pay off when feeding a memoized child or guarding genuinely expensive compute.
- Mutating `ref.current` never re-renders — great for timers/previous-value, wrong for anything the UI must reflect.

## Follow-ups
- **"Why must hooks run in the same order?"** React has no hook names — it maps the Nth `useState` call to the Nth slot. A conditional hook shifts every slot after it and corrupts state.
- **"useLayoutEffect vs useEffect?"** `useLayoutEffect` fires synchronously after DOM mutation, before paint — use it to measure/adjust layout and avoid flicker; otherwise prefer `useEffect`.
- **"Custom hooks?"** Just a function calling other hooks, named `useX`, to share stateful logic — no magic beyond the naming convention.

## Related
[[Performance-Optimization]] · [[React-Coding-Questions]] · [[Closures]]
