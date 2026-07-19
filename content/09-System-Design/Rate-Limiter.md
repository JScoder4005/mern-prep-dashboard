# System Design — Rate Limiter

## Q
Design an API rate limiter. Algorithms? Distributed rate limiting?

## A
Limit requests per client per time window (e.g. 100 req/min). Protects from abuse, DDoS, cost overrun. Common algo: **token bucket** or **sliding window**. Store counters in Redis (shared across servers).

## Algorithms
| Algo | Idea | Note |
|---|---|---|
| Fixed window | count per fixed minute | simple; burst at edges |
| Sliding window log | timestamps in window | accurate; more memory |
| Sliding window counter | weighted prev+cur window | good balance |
| Token bucket | tokens refill at rate, req consumes 1 | allows bursts (most used) |
| Leaky bucket | queue drains at fixed rate | smooth output |

## Code
Token bucket (in-memory concept):
```js
class TokenBucket {
  constructor(capacity, refillPerSec) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refill = refillPerSec;
    this.last = Date.now();
  }
  allow() {
    const now = Date.now();
    this.tokens = Math.min(
      this.capacity,
      this.tokens + ((now - this.last) / 1000) * this.refill
    );
    this.last = now;
    if (this.tokens >= 1) { this.tokens -= 1; return true; }
    return false;
  }
}
```

Distributed (Redis, fixed window):
```js
async function rateLimit(userId, limit = 100, windowSec = 60) {
  const key = `rl:${userId}:${Math.floor(Date.now() / 1000 / windowSec)}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec);
  return count <= limit;
}
```

Express middleware:
```js
async function limiter(req, res, next) {
  const ok = await rateLimit(req.ip);
  if (!ok) return res.status(429).json({ error: "Too Many Requests" });
  next();
}
```

## Why Redis
Multiple app servers must share the counter → central store (Redis atomic `INCR`). In-memory per-instance would let clients bypass by hitting different servers.

## Response
- 429 status + `Retry-After` / `X-RateLimit-Remaining` headers.

## Where / Scenario
- Public API abuse protection.
- Login brute-force protection (per IP/user).
- Costly endpoints (search, AI).
- API tiers (free vs paid limits).

## Related
[[Fundamentals]] · [[Sliding-Window]] · [[Middleware]]
