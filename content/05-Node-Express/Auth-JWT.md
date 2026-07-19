# Authentication — JWT

## Q
Explain JWT auth flow. Access vs refresh token. Where to store tokens? bcrypt why?

## A
JWT = signed token `header.payload.signature`. Server signs on login, client sends it on each request, server verifies signature (stateless — no session store). Passwords hashed with bcrypt (slow + salted).

## Code
Signup — hash password:
```js
const bcrypt = require("bcrypt");
const hash = await bcrypt.hash(password, 10); // 10 salt rounds
// store hash, never plain password
const ok = await bcrypt.compare(inputPassword, hash); // login check
```

Login — issue tokens:
```js
const jwt = require("jsonwebtoken");
const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, {
  expiresIn: "15m",       // short-lived
});
const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
  expiresIn: "7d",        // long-lived
});
// send refresh as httpOnly cookie, access in response body/header
res.cookie("refresh", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
```

Verify middleware:
```js
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.ACCESS_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: "invalid/expired token" });
  }
}
```

Refresh flow:
```js
app.post("/refresh", (req, res) => {
  const token = req.cookies.refresh;
  if (!token) return res.sendStatus(401);
  try {
    const { id } = jwt.verify(token, process.env.REFRESH_SECRET);
    const accessToken = jwt.sign({ id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    res.json({ accessToken });
  } catch { res.sendStatus(403); }
});
```

## Access vs Refresh
| | Access | Refresh |
|---|---|---|
| Life | short (15m) | long (7d) |
| Use | every request | get new access token |
| Storage | memory / header | httpOnly cookie |
| Leak impact | small (expires fast) | big → rotate + store server-side |

## Where to store (security)
- **Access** — memory (JS var). Avoid localStorage (XSS risk).
- **Refresh** — httpOnly + secure cookie (JS can't read → XSS-safe; add CSRF protection / sameSite).

## Why
- Short access limits leak window. Refresh avoids re-login.
- bcrypt slow + salted → resists brute force / rainbow tables.
- Stateless JWT scales horizontally (no shared session store).

## Where / Scenario
- SPA + REST API auth.
- Logout = clear cookie + refresh token blacklist/rotation.
- Session-based (cookie + server store) alternative when you need instant revoke.

## Related
[[Middleware]] · [[Error-Handling]] · [[Core-Services]]
