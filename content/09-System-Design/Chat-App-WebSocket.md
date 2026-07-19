# System Design — Real-Time Chat (WebSocket)

## Q
Design a real-time chat app. WebSocket vs polling? Scale across servers?

## A
Chat needs bidirectional real-time push → **WebSocket** (persistent connection), not HTTP polling. Scale with a pub/sub layer (Redis) so users on different servers get messages.

## WebSocket vs alternatives
| | Use |
|---|---|
| Polling | client asks every N s — wasteful, laggy |
| Long polling | hold request until data — better, still HTTP overhead |
| SSE | server→client only (notifications) |
| **WebSocket** | full duplex, low latency (chat, live) |

## Code (Socket.IO)
Server:
```js
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  socket.on("join", (roomId) => socket.join(roomId));
  socket.on("message", async (msg) => {
    await Message.create(msg);              // persist
    io.to(msg.roomId).emit("message", msg); // broadcast to room
  });
  socket.on("disconnect", () => {/* presence update */});
});
```
Client:
```js
const socket = io("wss://api.app.com");
socket.emit("join", roomId);
socket.on("message", (msg) => addToUI(msg));
socket.emit("message", { roomId, text, userId });
```

## Architecture (scaled)
```
Clients <--WSS--> LB (sticky sessions)
                    |-- WS Server 1 ---+
                    |-- WS Server 2 ---+-- Redis Pub/Sub (fan-out across servers)
                    |-- WS Server 3 ---+
                                       |-- DB (message history, Mongo/Cassandra)
                                       |-- Queue -> notifications (offline users)
```

## Requirements
- Functional: 1:1 + group chat, history, delivery/read receipts, presence, typing.
- Non-functional: low latency, ordered, durable, scale to millions.

## Data model
```
messages: { _id, roomId, senderId, text, createdAt, status }
rooms:    { _id, members[], type }
```

## Scale challenges + solutions
- **Multi-server** — user A on server1, user B on server2. Socket.IO Redis adapter / Redis pub/sub broadcasts across servers.
- **Sticky sessions** — LB keeps a client on same WS server.
- **Presence** — Redis (online set + TTL heartbeat).
- **Offline** — store + push notification (queue → FCM/APNs).
- **History/pagination** — DB indexed by `roomId + createdAt`.
- **Ordering** — server timestamp / sequence per room.
- **Delivery** — ack events; retry.

## Why
WebSocket = single persistent connection, instant push both ways. Redis pub/sub decouples message routing from which server holds the socket.

## Related
[[Fundamentals]] · [[Streams-Buffers]]
