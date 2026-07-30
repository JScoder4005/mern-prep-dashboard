# React — Modal / Dialog

## Q
Build a reusable modal: render via portal, close on overlay click + Escape, lock body scroll, trap focus, and stay accessible.

## Answer
Render the modal through `createPortal` into `document.body` so it escapes any ancestor's `overflow:hidden` or stacking context while staying part of the React tree (props/context intact). The behavioral checklist is what interviewers grade: close on **Escape** and **overlay click** (but not clicks inside the dialog), **lock body scroll** while open, **move focus in** and trap Tab within the dialog, restore focus to the trigger on close, and wire the ARIA roles (`role="dialog"`, `aria-modal`).

## How it works
`createPortal(node, target)` mounts the DOM node under `target` instead of the parent, which is why a modal buried inside a clipped/low-z-index container still renders on top. The overlay `onClick` closes; `stopPropagation` on the inner box stops that from firing when you click the content. All the imperative side effects (key listener, scroll lock, focus) live in one `useEffect` gated on `isOpen`, with a cleanup that removes the listener and restores scroll — so nothing leaks when the modal unmounts.

## Code
```jsx
import { useEffect, useRef, useState } from "react";
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

## Gotchas / a11y
- **Real focus trap:** the snippet moves focus in, but a production modal must also cycle Tab/Shift-Tab within the dialog and **restore focus to the trigger** on close — otherwise keyboard users get dumped at the top of the page.
- **Scroll lock has a cost:** setting `body.overflow = "hidden"` can cause a layout shift as the scrollbar disappears; compensate with padding equal to the scrollbar width for a jank-free lock.
- **Always clean up:** remove the `keydown` listener and restore `overflow` in the effect's return, or you leak listeners and leave the page unscrollable after unmount.
- ARIA: `role="dialog"` + `aria-modal="true"` + a label (`aria-label` or `aria-labelledby` pointing at the title).

## Follow-ups
- **"Why a portal instead of just `position: fixed`?"** Fixed still lives inside the parent's stacking context and can be clipped by an ancestor `overflow`/`transform`; a portal renders at body level, sidestepping both.
- **"Does a portal break event bubbling?"** No — React events bubble through the **React tree**, not the DOM tree, so a click inside the portal still reaches ancestors in JSX.
- **"How would you animate exit?"** Keep the node mounted during the closing transition (an `isClosing` state) and unmount on `transitionend`, since React removes portals instantly otherwise.

## Related
[[React-Coding-Questions]] · [[Hooks]] · [[Toast-Notifications]]
