# MongoDB Indexing

## Q
What are indexes? Single vs compound? How to find/fix a slow query? Trade-offs?

## A
Index = sorted data structure (B-tree) on field(s) for fast lookup. Without it, Mongo does a **collection scan** (COLLSCAN = read every doc). With it → IXSCAN. Speeds reads, slows writes + costs space.

## Code
```js
// single field
db.users.createIndex({ email: 1 });        // 1 = asc, -1 = desc

// compound (order matters! ESR rule: Equality, Sort, Range)
db.orders.createIndex({ userId: 1, createdAt: -1 });

// unique
db.users.createIndex({ email: 1 }, { unique: true });

// text index (search)
db.posts.createIndex({ title: "text", body: "text" });

// TTL (auto-expire docs)
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// analyze a query
db.orders.find({ userId: 123 }).sort({ createdAt: -1 }).explain("executionStats");
// look for: COLLSCAN (bad) vs IXSCAN (good), totalDocsExamined vs nReturned
```

## Compound index rule (ESR)
Order fields: **Equality** → **Sort** → **Range**. A query can use a **prefix** of a compound index.
```
index {userId:1, status:1, createdAt:-1}
serves: {userId}          ✅
        {userId, status}  ✅
        {status}          ❌ (not a prefix)
```

## How
`explain()` shows the plan. Fix slow query by adding index matching filter + sort. `totalDocsExamined ≈ nReturned` = efficient.

## Why
Read-heavy apps need indexes. But each index = extra write cost + RAM. Index what you query/sort/filter on, not everything.

## Where / Scenario
- Login by email → index email.
- Feed sorted by date per user → compound.
- Search → text index or Atlas Search.
- Slow query in prod → `explain()` first.

## Related
[[Aggregation-Pipeline]] · [[Schema-Design-Embed-vs-Reference]]
