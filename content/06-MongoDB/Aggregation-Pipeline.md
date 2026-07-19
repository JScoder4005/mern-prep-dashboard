# MongoDB Aggregation Pipeline

## Q
Explain the aggregation pipeline. Common stages. `$lookup` = SQL join?

## A
Pipeline = ordered stages, each transforms docs and passes to next. Used for grouping, joining, reshaping, analytics — beyond simple `find`.

## Code
```js
db.orders.aggregate([
  { $match: { status: "paid" } },                 // filter (use index, put first)
  { $group: {                                     // group + aggregate
      _id: "$userId",
      total: { $sum: "$amount" },
      count: { $sum: 1 },
      avg: { $avg: "$amount" },
  }},
  { $sort: { total: -1 } },                        // sort
  { $limit: 10 },                                  // top 10
]);
```

`$lookup` (left outer join):
```js
db.orders.aggregate([
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",                    // array of matched users
  }},
  { $unwind: "$user" },              // flatten array to object
  { $project: { amount: 1, "user.name": 1, _id: 0 } }, // shape output
]);
```

## Common stages
| Stage | Job |
|---|---|
| `$match` | filter (put early, uses index) |
| `$group` | aggregate by key ($sum,$avg,$max,$push) |
| `$sort` | order |
| `$project` | include/exclude/compute fields |
| `$lookup` | join another collection |
| `$unwind` | array → multiple docs |
| `$limit`/`$skip` | pagination |
| `$addFields` | add computed field |

## How
Docs flow stage→stage. `$match` + `$sort` early to use indexes and shrink data before heavy stages.

## Why
Server-side data processing (grouping, reporting) faster than pulling all docs to Node. `$lookup` = join in a document DB (but expensive — prefer embedding for hot paths).

## Where / Scenario
- Dashboards, reports, analytics (revenue per user).
- Join orders↔users↔products.
- Data transforms / ETL.

## Related
[[Indexing]] · [[Schema-Design-Embed-vs-Reference]]
