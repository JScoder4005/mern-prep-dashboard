# System Design Fundamentals

## Q
Core concepts: scaling, load balancing, caching, DB scaling, CAP, microservices.

## A
Senior interviews weight this heavily. Know the building blocks + trade-offs. Frame: requirements → estimate → API → data model → components → bottlenecks → scale.

## Concepts
**Scaling**
- Vertical — bigger machine. Simple, has a ceiling, single point of failure.
- Horizontal — more machines. Scales infinitely, needs load balancer + statelessness.

**Load balancer** — distribute traffic (round-robin, least-connections). Enables horizontal scale + failover. (nginx, ALB.)

**Caching** (Redis)
- Cache-aside: app checks cache → miss → DB → populate cache.
- Set TTL. Invalidate on write.
- Cache what's read-often, changes-rarely.
```
read: cache.get(key) ?? (db.get() -> cache.set(key, val, ttl))
write: db.update() -> cache.del(key)   // invalidate
```

**DB scaling**
- Indexing (first fix).
- Read replicas (scale reads).
- Sharding (partition data by key — scale writes).
- Replication (HA + failover).

**Message queue** (Kafka/RabbitMQ/SQS) — async decouple. Producer → queue → consumer. Handles spikes, retries, background jobs (email, image processing).

**CDN** — cache static assets near users (CloudFront).

**CAP theorem** — under network partition, pick Consistency OR Availability. Mongo/Dynamo tunable; SQL leans CP.

**Rate limiting** — protect API (token bucket / sliding window). See [[Rate-Limiter]].

**Idempotency** — same request twice = same effect (idempotency keys on payments).

**Microservices vs monolith**
| Monolith | Microservices |
|---|---|
| Simple, fast start | Independent scale/deploy |
| One deploy | Team autonomy |
| Tight coupling | Network complexity, observability cost |
Start monolith → split when scale/teams demand.

## Estimation
- DAU, QPS = requests/day / 86400, peak = ×2-3.
- Storage = items × size × retention.
- State assumptions out loud.

## How to answer (framework)
1. Clarify requirements (functional + non-functional: scale, latency).
2. Estimate load.
3. Draw high-level (client → LB → API → cache/DB/queue).
4. Data model + API.
5. Identify bottleneck → scale it (cache, replica, shard, queue).
6. Discuss trade-offs.

## Related
[[URL-Shortener]] · [[Rate-Limiter]] · [[Chat-App-WebSocket]] · [[Deploy-MERN-on-AWS]]
