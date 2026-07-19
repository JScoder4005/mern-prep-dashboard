# Docker Basics

## Q
Image vs container? Container vs VM? Explain layers + caching. Volumes?

## A
- **Image** — immutable blueprint (code + deps + runtime).
- **Container** — running instance of an image (isolated process).
- Containers share host OS kernel (lightweight); VMs run full guest OS (heavy).

## Code
Dockerfile:
```dockerfile
FROM node:20-alpine          # base image (small)
WORKDIR /app
COPY package*.json ./        # copy manifests FIRST (layer caching)
RUN npm ci                   # cached unless package.json changes
COPY . .                     # copy source
EXPOSE 3000
CMD ["node", "server.js"]    # start command
```

Common commands:
```bash
docker build -t myapp .           # build image
docker run -p 3000:3000 myapp     # run, map host:container port
docker ps                         # running containers
docker exec -it <id> sh           # shell into container
docker logs <id>                  # view logs
docker volume create data         # persistent storage
docker run -v data:/app/data myapp
```

## Layers & caching
Each Dockerfile instruction = a cached layer. If a layer's inputs unchanged → reuse cache. **Copy package.json + install BEFORE copying source** → deps layer cached, only rebuilds on dependency change (huge speedup).

## Container vs VM
| | Container | VM |
|---|---|---|
| Isolation | process (shared kernel) | full OS |
| Size | MBs | GBs |
| Start | seconds | minutes |
| Overhead | low | high |

## Volumes
Containers are ephemeral — data dies with container. **Volumes** persist data (DB files) outside container lifecycle.

## Why
Consistent env "works on my machine" solved. Fast, portable, scalable, isolated.

## Where / Scenario
- Package MERN app + deps into one image.
- Persist Mongo data via volume.
- Same image dev → staging → prod.

## Related
[[Multi-Stage-Build]] · [[Docker-Compose]]
