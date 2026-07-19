# State Management

## Q
Context vs Redux vs Zustand — when use which? Local vs global state?

## A
Use the **lowest-scope** solution that works. Local state → `useState`. Shared across few components → lift up / Context. Complex global with many updates → Redux Toolkit / Zustand.

## Code
Context (simple global, low-frequency):
```jsx
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]); // memo avoids re-render
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
const useAuth = () => useContext(AuthContext);
```

Redux Toolkit (large app, dev tools, middleware):
```js
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    add: (state, action) => { state.items.push(action.payload); }, // Immer = safe mutation
    remove: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});
export const { add, remove } = cartSlice.actions;
```

Zustand (minimal global, no boilerplate):
```js
const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));
// component: const count = useStore((s) => s.count);
```

## Decision table
| Need | Use |
|---|---|
| One component | `useState` |
| Few nested | lift state / props |
| App-wide, rare change (theme, auth) | Context |
| Large, frequent, complex | Redux Toolkit |
| Simple global, less boilerplate | Zustand |
| Server data / caching | React Query / RTK Query |

## Why
Context re-renders ALL consumers on value change → bad for high-frequency updates. Redux/Zustand use selectors → subscribe to slices only.

## Where / Scenario
- Auth/theme → Context.
- Cart/complex domain → Redux Toolkit.
- **Server state (API data) → React Query**, not Redux (caching, refetch, stale).

## Related
[[Hooks]] · [[Type-Narrowing]] · [[Performance-Optimization]]
