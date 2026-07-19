# React — Modal / Dialog

## Q
Build a reusable modal: render via portal, close on overlay click + Escape, lock body scroll, focus trap, accessible.

## A
Use `createPortal` to render outside parent DOM (avoids z-index/overflow clipping). Handle Escape, overlay click, body scroll lock, focus.

## Code
```jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ isOpen, onClose, title, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";      // lock scroll
    ref.current?.focus();                          // move focus in
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";           // restore
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}                             // overlay click closes
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
               display: "grid", placeItems: "center", zIndex: 1000 }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}        // click inside doesn't close
        style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 320 }}
      >
        <header style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="Close">×</button>
        </header>
        {children}
      </div>
    </div>,
    document.body                                   // portal target
  );
}

// usage
function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm">
        <p>Are you sure?</p>
      </Modal>
    </>
  );
}
```

## How
`createPortal(node, document.body)` renders the modal at body level (escapes parent `overflow:hidden`/stacking). `stopPropagation` on inner box so overlay-click-close only triggers on the backdrop.

## Why portal
Modal nested deep inside a component with `overflow:hidden` or low z-index would clip. Portal renders it top-level while keeping React tree/props/context.

## Gotchas / a11y
- `role="dialog"` + `aria-modal`.
- Escape + overlay click to close.
- Lock body scroll while open.
- Focus trap (Tab cycles within modal); restore focus to trigger on close.
- Cleanup listeners on unmount.

## Related
[[React-Coding-Questions]] · [[Hooks]]
