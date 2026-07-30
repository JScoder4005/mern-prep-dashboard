# React — Toast Notification System

## Q
Build a toast system: trigger from anywhere, auto-dismiss, stack multiple, types (success/error), manual close.

## Answer
Make it global with a Context provider that owns a `toasts` array, and expose a `useToast()` hook so any component can fire one without prop-drilling. `addToast` pushes a toast with a unique id and schedules a `setTimeout` to remove it after a duration; the provider also renders the fixed-position stack. Support types (success/error/info) via a color map and let a click dismiss manually.

## Code
```jsx
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) =>
    setToasts((t) => t.filter((x) => x.id !== id)), []);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => remove(id), duration);   // auto-dismiss
  }, [remove]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: "fixed", top: 16, right: 16, display: "grid", gap: 8, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => remove(t.id)}
            style={{
              padding: "12px 16px", borderRadius: 6, color: "#fff", cursor: "pointer",
              background: { success: "#16a34a", error: "#dc2626", info: "#2563eb" }[t.type],
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// usage
function App() {
  return (
    <ToastProvider>
      <Page />
    </ToastProvider>
  );
}
function Page() {
  const { addToast } = useToast();
  return <button onClick={() => addToast("Saved!", "success")}>Save</button>;
}
```

## How it works
The provider holds the toast list and a fixed container that maps over it. `addToast` appends a toast and calls `setTimeout(remove, duration)`; `remove` filters by id. Both are wrapped in `useCallback` so the context value stays stable and so `addToast` can safely depend on `remove`. Any descendant grabs `addToast` from `useToast()` — the provider is the only owner of the array.

## Gotchas
- **Functional state updates are required** — `setToasts(t => [...t, next])`, not `setToasts([...toasts, next])`. Fire two toasts in the same tick with the stale-closure version and the second overwrites the first.
- The `setTimeout` should ideally be **cleared on unmount** to avoid setting state on an unmounted provider; in practice the provider lives for the app's lifetime, but mention it.
- Keys must be unique even for identical messages fired in the same millisecond — `Date.now() + Math.random()` (or a counter/`crypto.randomUUID()`) avoids collisions.

## Follow-ups
- **"Pause on hover?"** Store each toast's remaining time; clear the timer on `mouseenter`, restart it on `mouseleave`.
- **"Cap the stack?"** On add, if length ≥ max, drop the oldest (`slice(1)`) before appending.
- **"Animate exit?"** Mark a toast `leaving`, play a CSS transition, then remove on `transitionend` — React unmounts instantly otherwise. Portal the container to `document.body` like [[Modal]].

## Related
[[State-Management]] · [[Modal]] · [[Hooks]]
