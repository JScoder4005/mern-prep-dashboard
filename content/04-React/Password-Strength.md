# React — Password Strength Meter

## Q
Build a password strength meter: score rules, colored bar, live feedback.

## Answer
Keep exactly one piece of state — the password string — and **derive everything else on render**: a pure `scorePassword` function returns 0–4, and the bar width, color, and label come from that score. No `useEffect`, no second state for "strength"; storing what you can compute is the classic derived-state anti-pattern that leads to the two falling out of sync. Be clear that a client meter is UX only — real strength enforcement and hashing belong on the server.

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

## How it works
`scorePassword` is a pure, independently-testable function of the string. The component computes `score` and `level` inline every render — because they're a deterministic function of `pw`, they can never drift from it. The bar is four segments filled when `i < score`, colored by the current level. This clean split (logic vs UI) is exactly what interviewers want to see.

## Gotchas
- **Don't mirror score into state.** `const score = scorePassword(pw)` on render is correct; a `useState`/`useEffect` copy just adds a way to be wrong and an extra render.
- Naive rule-based scoring is easily gamed — `"Password123!"` scores "Strong" but is terrible. Say so, and reach for entropy-based `zxcvbn` in production.
- The meter is advisory UX; **never** treat client-side score as security. Enforce policy and hash (bcrypt/argon2) on the server — see [[Auth-JWT]].

## Follow-ups
- **"Why derived over stored state?"** One source of truth (the password) can't desync; stored derived state needs an effect to keep it current and invites stale-value bugs.
- **"Debounce it?"** Scoring is cheap so no; but if you called an API (e.g. breach check), debounce the input and cancel stale requests.
- **"How to make scoring testable/extensible?"** Keep it a pure function with an array of rule predicates — easy to unit test and to add rules (dictionary words, repeats).

## Related
[[React-Coding-Questions]] · [[Auth-JWT]]
