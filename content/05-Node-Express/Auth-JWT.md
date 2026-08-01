# Authentication — JWT

## Q
Explain JWT auth flow. Access vs refresh token. Where to store tokens? bcrypt why?

## Answer
A JWT is a signed `header.payload.signature` blob the server issues on login and the client resends on every request — the server just verifies the signature, so no session store is needed and it scales horizontally. The real design decision is splitting into a short-lived **access token** (15m, sent per-request, kept in memory) and a long-lived **refresh token** (7d, httpOnly cookie, only used to mint new access tokens): a leaked access token expires fast, a leaked refresh token is the expensive case and needs rotation/revocation. Passwords never touch this — they're hashed with bcrypt (salted + deliberately slow) so a DB leak doesn't hand out plaintext credentials.

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

## Gotchas
- **Never put the access token in localStorage** — any XSS on the page can read it. Keep it in memory (a JS variable / React state) and re-fetch on reload via the refresh cookie.
- **Refresh token must be httpOnly + secure + sameSite** — JS can't read it (XSS-safe) and the browser won't send it cross-site (CSRF-resistant), but pair with CSRF tokens for state-changing requests if you also accept the cookie on non-idempotent routes.
- **Stateless JWTs can't be revoked mid-life** — "logout everywhere" or a compromised account needs either a short access-token TTL you just wait out, or a server-side blacklist/rotation table for refresh tokens (which reintroduces state, on purpose, for the token that matters).
- **bcrypt rounds are a tunable cost, not a fixed constant** — bump the salt-round count as hardware gets faster; too low and offline brute-force gets cheap.

## Follow-ups
- **"How do you revoke a compromised refresh token?"** Store issued refresh tokens (or their hash) server-side with a revoked flag; check it on `/refresh`. Rotate on every use so a stolen token that's already been redeemed is detected.
- **"Why not just one long-lived token?"** Then every leak is a full-session compromise for its whole lifetime — splitting access/refresh bounds the blast radius of the token that's actually exposed on every request.
- **"Session cookies vs JWT — when would you pick sessions?"** When you need instant revoke or need to store more server-side state per user than fits in a token payload; JWT wins when you need to scale reads across servers without a shared session store.

## Related
[[Middleware]] · [[Error-Handling]] · [[Core-Services]]
