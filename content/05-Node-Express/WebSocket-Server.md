# WebSocket Server (Socket.IO)

## Q
How do WebSockets work? Build a real-time server. Rooms, broadcast, scaling across instances.

## A
WebSocket = persistent full-duplex TCP connection over one handshake (upgrades from HTTP). Server pushes to clients without polling. Socket.IO adds rooms, reconnection, fallbacks.

## Code
Server:
```js
const { Server } = require("socket.io");
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("join", (room) => socket.join(room));        // room = channel

  socket.on("message", async (msg) => {
    await Message.create(msg);                            // persist
    io.to(msg.room).emit("message", msg);                // broadcast to room
  });

  socket.on("typing", (room) => socket.to(room).emit("typing", socket.id));

  socket.on("disconnect", () => console.log("bye", socket.id));
});
```

Client:
```js
import { io } from "socket.io-client";
const socket = io("wss://api.app.com");
socket.emit("join", "room1");
socket.on("message", (msg) => render(msg));
socket.emit("message", { room: "room1", text: "hi", user: "A" });
```

## Emit targets
```js
socket.emit(...)          // to this client only
io.emit(...)              // to ALL clients
io.to(room).emit(...)     // to everyone in room (incl sender)
socket.to(room).emit(...) // to room EXCEPT sender
socket.broadcast.emit(..) // all except sender
```

## Scaling across servers
Multiple Node instances → a client on server A can't reach a socket on server B. Fix: **Redis adapter** (pub/sub) fans events across instances.
```js
const { createAdapter } = require("@socket.io/redis-adapter");
io.adapter(createAdapter(pubClient, subClient));
```
Also need **sticky sessions** at the load balancer (keep client on same instance).

## WebSocket vs alternatives
| | Use |
|---|---|
| Polling | simple, wasteful |
| SSE | server→client only (notifications, feeds) |
| WebSocket | bidirectional real-time (chat, games, live) |

## Why
No repeated HTTP overhead; instant server push both ways; low latency.

## Where / Scenario
Chat, live notifications, collaborative editing, live dashboards, multiplayer, presence/typing. Full design: [[Chat-App-WebSocket]].

## Related
[[Chat-App-WebSocket]] · [[Redis-Caching]] · [[Node-Event-Loop]]
