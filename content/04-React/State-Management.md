# State Management

## Q
Context vs Redux vs Zustand — when do you use each? How do you decide local vs global state?

## Answer
Reach for the **lowest-scope tool that works**. Purely local → `useState`/`useReducer`. Shared by a few nearby components → lift the state up or pass props. App-wide but low-frequency (theme, auth) → Context. Large, frequently-updated, complex domain state → a selector-based store like **Redux Toolkit** or **Zustand**. And critically: **server data is not client state** — cache it with React Query / RTK Query instead of hand-rolling fetch state into Redux.

## How it works
Context re-renders **every** consumer whenever the provider value changes — fine for rarely-changing globals, painful for high-frequency updates. Redux and Zustand fix that with **selectors**: a component subscribes to just the slice it reads, so unrelated updates don't re-render it. Redux Toolkit uses Immer so reducers can "mutate" a draft safely; Zustand is a minimal store hook with almost no boilerplate.

## Code
Context — simple global, low-frequency (memoize the value so consumers don't thrash):
```jsx
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // memo: keep the value's identity stable unless `user` changes
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
const useAuth = () => useContext(AuthContext);
```

Redux Toolkit — large app, devtools, middleware (Immer lets you write "mutations"):
```js
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    add: (state, action) => { state.items.push(action.payload); },   // Immer draft
    remove: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});
export const { add, remove } = cartSlice.actions;
```

Zustand — minimal global, no providers/boilerplate:
```js
const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));
// in a component: const count = useStore((s) => s.count); // subscribes to just `count`
```

## Decision table
| Need | Use |
|---|---|
| One component | `useState` |
| A few nested components | lift state / props |
| App-wide, rare change (theme, auth) | Context |
| Large, frequent, complex | Redux Toolkit |
| Simple global, less boilerplate | Zustand |
| Server data / caching | React Query / RTK Query |

## Gotchas
- **An unmemoized Context value re-renders all consumers every render** — the provider passes a new object identity each time. Wrap it in `useMemo`.
- Don't push server data into Redux and reinvent caching, refetching, and staleness — React Query already does dedup, background refetch, and cache invalidation.
- Splitting one giant context into focused ones (auth vs theme vs cart) limits re-render blast radius without adopting a store library.

## Follow-ups
- **"Why does Context cause re-renders that Redux doesn't?"** Context has no selector layer — any value change notifies every consumer. Redux/Zustand subscribe per-selector, so only components reading the changed slice update.
- **"useReducer vs Redux?"** `useReducer` is local, per-component reducer state; Redux is a single global store with middleware, devtools, and cross-component access.
- **"Is Redux still relevant?"** Yes for large teams/complex flows, but many apps now do Context + React Query, or Zustand, with far less boilerplate.

## Related
[[Hooks]] · [[Type-Narrowing]] · [[Performance-Optimization]]
