# File Upload (Node/Express)

## Q
Handle file uploads in Express. Multer. Direct-to-S3. Validation, large files.

## A
Small/simple → `multer` (multipart parser) to disk/memory then process. Scalable → presigned URL, client uploads direct to S3 (backend never touches bytes).

## Code
Multer (to memory, then S3):
```js
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },              // 5MB cap
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png"].includes(file.mimetype);
    cb(ok ? null : new Error("Invalid type"), ok);    // validate type
  },
});

app.post("/upload", auth, upload.single("file"), async (req, res) => {
  const { originalname, buffer, mimetype } = req.file;
  const key = `uploads/${req.user.id}/${Date.now()}-${originalname}`;
  await s3.send(new PutObjectCommand({
    Bucket: "my-bucket", Key: key, Body: buffer, ContentType: mimetype,
  }));
  await File.create({ key, owner: req.user.id });
  res.json({ key });
});

// multiple: upload.array("files", 5)
```

Direct-to-S3 (presigned — best for large/scale):
```js
// backend just signs; client PUTs file straight to S3
// see S3-Presigned-URL note
```

## multer storage options
| Storage | Use |
|---|---|
| `memoryStorage` | small files, process/forward to S3 |
| `diskStorage` | save to server disk (temp) |
| stream to S3 | large files, low memory |

## Best practices
- **Validate**: type (mimetype + magic bytes), size limit, filename sanitize.
- **Don't trust** client filename/extension.
- **Large files** → presigned URL (skip server) or stream + multipart. See [[S3-Presigned-URL]] · [[Streams-Buffers]].
- Store metadata (key, owner, size) in DB; file in S3.
- Virus scan / image resize async (queue).
- Never store uploads in git / public web root without auth.

## Why direct-to-S3
Server memory/bandwidth not consumed, no request timeout on big files, S3 scales. Backend only issues short-lived signed URL.

## Where / Scenario
Profile pics, docs, media, CSV imports.

## Related
[[S3-Presigned-URL]] · [[Streams-Buffers]] · [[Middleware]]
