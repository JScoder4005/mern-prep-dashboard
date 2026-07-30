# React — OTP Input Component

## Q
Build an OTP input: N boxes, auto-focus next on type, backspace to previous, paste fills all, digits only.

## Answer
Model the value as an **array of controlled single-char inputs** and keep a **refs array** for imperative focus. On typing a digit, write it into that slot and auto-advance focus to the next box; on Backspace, clear the current box or, if it's already empty, move back and clear the previous one; on Paste, spread the pasted digits across the boxes at once. Filter to digits only and fire `onComplete` once every slot is filled.

## Code
```jsx
import { useRef, useState } from "react";

function OtpInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputs = useRef([]);

  const focus = (i) => inputs.current[i]?.focus();

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, ""); // digits only
    if (!val) return;
    const next = [...otp];
    next[i] = val[val.length - 1];                 // last typed char
    setOtp(next);
    if (i < length - 1) focus(i + 1);              // auto-advance
    if (next.every((d) => d)) onComplete?.(next.join(""));
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      const next = [...otp];
      if (otp[i]) next[i] = "";                     // clear current
      else if (i > 0) { next[i - 1] = ""; focus(i - 1); } // go back
      setOtp(next);
    }
    if (e.key === "ArrowLeft" && i > 0) focus(i - 1);
    if (e.key === "ArrowRight" && i < length - 1) focus(i + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = [...otp];
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setOtp(next);
    focus(Math.min(digits.length, length - 1));
    if (next.every((d) => d)) onComplete?.(next.join(""));
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          maxLength={1}
          inputMode="numeric"
          style={{ width: 40, height: 40, textAlign: "center", fontSize: 20 }}
        />
      ))}
    </div>
  );
}
```

## How it works
`inputs.current` is an array of DOM refs, populated by the `ref={el => inputs.current[i] = el}` callback — that's how you focus a *sibling* box imperatively without controlling focus through state. State updates are immutable copies (`const next = [...otp]`) so React sees a new array and re-renders. `onChange` handles typing + advance, `onKeyDown` handles Backspace/arrows (keydown, because Backspace on an empty controlled input fires no `change`), and `onPaste` fills everything.

## Gotchas
- **Backspace needs `onKeyDown`, not `onChange`** — deleting an already-empty box produces no change event, so the "go back and clear previous" logic must live in the keydown handler.
- Take the **last character** typed (`val[val.length - 1]`), so retyping into a filled box replaces rather than rejects.
- Paste must `preventDefault()` (or the raw string dumps into one box) and be sliced to `length`.
- `inputMode="numeric"` (plus digits-only regex) gives mobile users the number pad and blocks non-digits.

## Follow-ups
- **"Why a ref array instead of focus-by-state?"** Focus is imperative DOM, not render output — driving it through state causes extra renders and race conditions. `useRef` is the right tool for "reach into the DOM".
- **"Masked/secure OTP?"** Swap `type="text"` for `type="password"` or render dots; the logic is unchanged.
- **"Accessibility?"** Label the group, announce completion via `aria-live`, and keep arrow-key navigation for screen-reader/keyboard users.

## Related
[[React-Coding-Questions]] · [[Hooks]]
