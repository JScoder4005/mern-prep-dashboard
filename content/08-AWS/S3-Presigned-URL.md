# S3 Presigned URLs

## Q
What is a presigned URL? Why use it for file uploads instead of routing through your server?

## A
Presigned URL = a temporary, signed URL granting time-limited permission to upload/download a specific S3 object. Client uploads **directly to S3**, bypassing your backend.

## Code
Generate upload URL (Node, AWS SDK v3):
```js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: "ap-south-1" });

app.post("/upload-url", auth, async (req, res) => {
  const key = `uploads/${req.user.id}/${Date.now()}-${req.body.filename}`;
  const command = new PutObjectCommand({
    Bucket: "my-bucket",
    Key: key,
    ContentType: req.body.contentType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min
  res.json({ url, key });
});
```

Client uploads directly:
```js
const { url, key } = await fetch("/upload-url", {...}).then(r => r.json());
await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
// then save `key` to DB via your API
```

## How
Backend signs a request with its AWS creds → URL embeds signature + expiry. S3 validates signature; anyone with the URL can do that one action until it expires.

## Why
- Server never handles file bytes → no memory/bandwidth load, no timeouts on big files.
- Scales: S3 handles upload directly.
- Secure: short expiry, scoped to one key + operation, backend controls who gets a URL (auth).

## Where / Scenario
- Profile pics, documents, video uploads.
- Private downloads (presigned GET with expiry).
- Any large file — never proxy through Node.

## Related
[[Core-Services]] · [[Streams-Buffers]]
