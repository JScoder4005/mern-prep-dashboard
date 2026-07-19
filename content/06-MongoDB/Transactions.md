# MongoDB Transactions

## Q
Does MongoDB support transactions? When needed? ACID in Mongo?

## A
Yes — multi-document ACID transactions since 4.0 (needs replica set). Single-doc writes are already atomic. Use transactions only for multi-doc all-or-nothing operations.

## Code
```js
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Account.updateOne({ _id: from }, { $inc: { balance: -100 } }, { session });
  await Account.updateOne({ _id: to },   { $inc: { balance: +100 } }, { session });
  await session.commitTransaction();   // both or neither
} catch (err) {
  await session.abortTransaction();    // rollback
  throw err;
} finally {
  session.endSession();
}
```

## How
All ops share a `session`. Commit applies atomically; abort rolls back. Snapshot isolation during the transaction.

## Why
Money transfer, inventory + order, any invariant across docs must not partially apply. Single-doc atomicity often avoids needing this (favor embedding).

## Cost / caution
- Transactions have overhead + locks → don't overuse.
- Prefer schema design (embed related data) so single-doc atomic write suffices.
- Require replica set (Atlas has it by default).

## Where / Scenario
- Bank transfer (debit + credit).
- Place order (create order + decrement stock + clear cart).
- Anything needing rollback on partial failure.

## ACID note
| | Mongo |
|---|---|
| Atomic | ✅ single doc always; multi-doc via txn |
| Consistent | ✅ |
| Isolated | snapshot in txn |
| Durable | write concern + journal |

## Related
[[Schema-Design-Embed-vs-Reference]]
