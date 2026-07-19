# Redis & Caching

## Q
Why Redis? Cache-aside pattern, TTL, invalidation. What to cache? Cache stampede?

## A
Redis = in-memory key-value store (sub-ms). Used for caching, sessions, rate limiting, pub/sub, queues. Cache hot/expensive reads to cut DB load + latency.

## Code
Cache-aside (lazy loading) — most common:
```js
const redis = require("redis");
const client = redis.createClient();
await client.connect();

async function getUser(id) {
  const key = `user:${id}`;
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);        // HIT

  const user = await User.findById(id);          // MISS -> DB
  await client.set(key, JSON.stringify(user), { EX: 3600 }); // cache 1h TTL
  return user;
}

// invalidate on write
async function updateUser(id, data) {
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  await client.del(`user:${id}`);                // drop stale cache
  return user;
}
```

Express cache middleware:
```js
function cache(ttl = 60) {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const hit = await client.get(key);
    if (hit) return res.json(JSON.parse(hit));
    res.sendResponse = res.json;
    res.json = (body) => {
      client.set(key, JSON.stringify(body), { EX: ttl });
      res.sendResponse(body);
    };
    next();
  };
}
app.get("/products", cache(300), getProducts);
```

## Caching strategies
| Strategy | How |
|---|---|
| Cache-aside | app checks cache, loads DB on miss (above) |
| Write-through | write to cache + DB together |
| Write-behind | write cache, async flush to DB |
| Read-through | cache layer loads from DB itself |

## Invalidation (the hard part)
- **TTL** — expire after N sec (eventual freshness).
- **On write** — `del` key when data changes.
- **Versioned keys** — `user:5:v2`.

## Pitfalls
- **Cache stampede** — key expires, many requests hit DB at once. Fix: lock / stale-while-revalidate / jittered TTL.
- **Stale data** — invalidate on writes.
- Don't cache highly dynamic / per-user-unique unless needed.

## What to cache
Hot, read-often, changes-rarely: product catalog, config, sessions, computed aggregates, API responses.

## Why
DB read O(ms-100ms) → Redis O(<1ms). Offloads DB, scales reads massively.

## Where / Scenario
Session store, rate limiting (see [[Rate-Limiter]]), leaderboards (sorted sets), pub/sub for [[Chat-App-WebSocket]], job queues.

## Related
[[Indexing]] · [[Fundamentals]] · [[Rate-Limiter]]
