# Streams & Buffers

## Q
What are streams and buffers? Why stream instead of reading whole file? Types of streams?

## A
- **Buffer** — fixed chunk of raw binary memory (outside V8 heap).
- **Stream** — process data in chunks over time instead of loading all in memory. Huge for large files / real-time.

## Code
Read whole file (BAD for large):
```js
const data = fs.readFileSync("big.mp4"); // loads entire file into RAM
```

Stream (GOOD — constant memory):
```js
const fs = require("fs");
const readStream = fs.createReadStream("big.mp4");
readStream.pipe(res); // stream file to HTTP response, low memory
```

Pipe with transform (gzip):
```js
const zlib = require("zlib");
fs.createReadStream("input.txt")
  .pipe(zlib.createGzip())          // transform
  .pipe(fs.createWriteStream("input.txt.gz"));
```

Manual chunks:
```js
readStream.on("data", (chunk) => console.log("chunk", chunk.length));
readStream.on("end", () => console.log("done"));
readStream.on("error", (err) => console.error(err));
```

Buffer basics:
```js
const buf = Buffer.from("hello");     // <Buffer 68 65 6c 6c 6f>
buf.toString();                       // "hello"
buf.length;                           // 5 bytes
```

## Stream types
| Type | Example |
|---|---|
| Readable | `fs.createReadStream`, `req` |
| Writable | `fs.createWriteStream`, `res` |
| Duplex | TCP socket |
| Transform | gzip, encryption |

## How
`pipe()` connects readable → writable, handles backpressure (slows source if sink busy). Data flows in ~64KB chunks by default.

## Why
Memory efficient (stream a 2GB file with MBs of RAM). Faster time-to-first-byte. Backpressure prevents overload.

## Where / Scenario
- File upload/download, video streaming.
- Large CSV/log processing.
- Piping request → transform → response.
- `req`/`res` in Express ARE streams.

## Related
[[Node-Event-Loop]]
