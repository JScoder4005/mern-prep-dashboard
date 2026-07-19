# React — Password Strength Meter

## Q
Build a password strength meter: score rules, colored bar, live feedback.

## A
Pure scoring function → 0-4. Derive bar width/color/label from score. No extra state — compute on render.

## Code
```jsx
import { useState } from "react";

function scorePassword(pw) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++; // mixed case
  if (/\d/.test(pw)) score++;                        // number
  if (/[^A-Za-z0-9]/.test(pw)) score++;              // symbol
  return score; // 0..4
}

const LEVELS = [
  { label: "Too weak", color: "#dc2626" },
  { label: "Weak", color: "#f97316" },
  { label: "Fair", color: "#eab308" },
  { label: "Good", color: "#22c55e" },
  { label: "Strong", color: "#16a34a" },
];

function PasswordStrength() {
  const [pw, setPw] = useState("");
  const score = scorePassword(pw);
  const level = LEVELS[score];

  return (
    <div style={{ width: 280 }}>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Password"
        style={{ width: "100%" }}
      />
      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 6, borderRadius: 3,
              background: i < score ? level.color : "#e5e7eb",
            }}
          />
        ))}
      </div>
      {pw && <small style={{ color: level.color }}>{level.label}</small>}
    </div>
  );
}
```

## How
`scorePassword` = pure function, testable. Component derives everything from score — no redundant state (single source = the password string).

## Why interviewers ask
Derived state (don't store what you can compute), regex, pure functions, clean separation of logic/UI.

## Note
- Client meter = UX only. **Real strength enforcement + hashing happens server-side** (bcrypt). See [[Auth-JWT]].
- Production: use `zxcvbn` lib (entropy-based, catches "Password123!").

## Related
[[React-Coding-Questions]] · [[Auth-JWT]]
