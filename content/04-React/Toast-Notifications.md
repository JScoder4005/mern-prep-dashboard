# React — Toast Notification System

## Q
Build a toast system: trigger from anywhere, auto-dismiss, stack multiple, types (success/error), manual close.

## A
Global via Context + provider holding a toast array. `useToast()` hook exposes `addToast`. Each toast auto-removes after timeout.

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

## How
Provider owns the toast list + portal-like fixed container. `addToast` pushes + schedules removal. Any component calls `useToast()` — no prop drilling.

## Why interviewers ask
Context API for global UI, custom hook API design, timers + cleanup, unique keys, memoized callbacks.

## Extensions
- Pause auto-dismiss on hover.
- Slide/fade animation (CSS transition + exit state).
- Max stack (drop oldest).
- Portal to `document.body`. See [[Modal]].

## Related
[[State-Management]] · [[Modal]] · [[Hooks]]
