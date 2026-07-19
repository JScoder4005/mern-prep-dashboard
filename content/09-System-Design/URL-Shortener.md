# System Design — URL Shortener (TinyURL)

## Q
Design a URL shortener. Handle billions of URLs, fast redirect.

## A
Map long URL → short code. Write once, read heavy (redirect). Core = ID generation + fast lookup + caching.

## Requirements
- Functional: shorten(longUrl) → shortUrl; redirect(shortUrl) → longUrl; optional custom alias, expiry, analytics.
- Non-functional: low-latency redirect (<50ms), high availability, ~100:1 read:write.

## Estimate
- 100M new URLs/month → ~40 writes/s, ~4000 reads/s.
- Short code: base62 [a-zA-Z0-9], length 7 → 62^7 ≈ 3.5 trillion.

## API
```
POST /shorten { longUrl }        -> { shortUrl }
GET  /{code}                     -> 302 redirect to longUrl
```

## Data model
```
urls: { code (PK), longUrl, createdAt, expiresAt, userId, clicks }
```

## Code generation approaches
1. **Counter + base62** — auto-increment ID → encode base62. Short, no collision. Need distributed counter (Redis INCR / ticket server / Zookeeper).
2. **Hash (MD5) + take 7 chars** — collision possible → check + retry.
3. **Random base62** — check DB for collision.

```js
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function encode(num) {
  let s = "";
  while (num > 0) { s = CHARS[num % 62] + s; num = Math.floor(num / 62); }
  return s.padStart(7, "0");
}
```

## Architecture
```
Client -> LB -> App servers
                  |-- Redis cache (code -> longUrl, hot redirects)
                  |-- DB (sharded by code, e.g. Cassandra/DynamoDB/Mongo)
                  |-- Counter service (Redis INCR) for IDs
Analytics: async via queue -> data store (don't block redirect)
```

## Scale points
- **Cache** hot codes in Redis → most redirects never hit DB.
- **Shard** DB by code hash.
- **CDN / edge** for popular links.
- Redirect = 301 (permanent, cacheable) vs 302 (temporary, lets you track clicks).
- Analytics async (queue) — never slow the redirect.

## Trade-offs
- 301 caches in browser (fewer hits, no analytics) vs 302 (analytics, more load).
- Counter = short codes but central dependency; random = no dependency but collision checks.

## Related
[[Fundamentals]] · [[Rate-Limiter]]
