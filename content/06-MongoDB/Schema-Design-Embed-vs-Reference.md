# Schema Design — Embed vs Reference

## Q
Embed vs reference — how decide? Give rule. When NOT to use MongoDB?

## A
- **Embed** — nest related data in one doc. Fast reads (one query), atomic. Best for 1:1, 1:few, data read together.
- **Reference** — store `ObjectId`, join via `$lookup`/`populate`. Best for 1:many (large), many:many, shared/large data.

## Code
Embed (comments in post — read together):
```js
{
  _id: 1,
  title: "Post",
  comments: [
    { user: "A", text: "nice" },
    { user: "B", text: "cool" },
  ],
}
// one query gets post + comments
```

Reference (orders → user, unbounded):
```js
// orders
{ _id: 1, userId: ObjectId("..."), amount: 100 }
// users
{ _id: ObjectId("..."), name: "Varun" }

// Mongoose populate
Order.find().populate("userId");
```

## Decision rule
| Use EMBED when | Use REFERENCE when |
|---|---|
| Read together always | Queried independently |
| 1:1 or 1:few (bounded) | 1:many (unbounded, grows forever) |
| Data doesn't change often | Shared across many docs |
| Need atomic single-doc write | Data large / duplicated |

**Anti-pattern:** unbounded arrays (embedding millions of comments) → 16MB doc limit + slow. Reference instead.

## Mongoose tips
```js
const schema = new Schema({ name: String }, { timestamps: true });
schema.index({ email: 1 });
Model.find().lean();          // plain JS objects, faster (no Mongoose docs)
schema.pre("save", fn);       // hooks/middleware
```

## When NOT MongoDB
- Heavy multi-table transactions / strong relational integrity → SQL (Postgres).
- Complex joins across many entities → SQL.
- Flat tabular analytics → columnar/SQL.

## Why
Document model optimizes for "data accessed together lives together." Reduces joins but can duplicate. Balance read speed vs duplication/consistency.

## Where / Scenario
- Embed: user profile + address, post + tags, order + line items.
- Reference: user ↔ orders, product catalog shared across orders.

## Related
[[Indexing]] · [[Aggregation-Pipeline]] · [[Transactions]]
