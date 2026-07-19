# React — OTP Input Component

## Q
Build an OTP input: N boxes, auto-focus next on type, backspace to previous, paste fills all, digits only.

## A
Array of controlled inputs + `refs` array for focus control. Handle type, backspace, paste, arrow keys.

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

## How
`inputs.current[i]` = DOM ref per box. On change → set value, focus next. On backspace → clear + focus prev. Paste → spread digits across boxes.

## Why interviewers ask
Tests `useRef` for imperative focus, array state (immutable updates), event handling (keydown/paste), edge cases.

## Gotchas
- Digits only (`replace(/\D/g,"")`).
- Backspace on empty box → move back.
- Paste must fill all + `preventDefault`.
- `inputMode="numeric"` → mobile numeric keyboard.

## Related
[[React-Coding-Questions]] · [[Hooks]]
