# Docker Multi-Stage Build

## Q
What is a multi-stage build? Why? How to shrink a Node image?

## A
Multi-stage = multiple `FROM` stages in one Dockerfile. Build in a heavy stage, copy only artifacts into a slim final stage. Final image excludes build tools + dev deps → small + secure.

## Code
Node app:
```dockerfile
# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                       # includes devDeps for build
COPY . .
RUN npm run build                # produces dist/

# Stage 2: production (slim)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev            # prod deps only
COPY --from=build /app/dist ./dist   # copy artifact from stage 1
USER node                        # non-root (security)
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

React app (build then serve via nginx):
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

## Shrink image checklist
- `alpine` base (small).
- Multi-stage → drop build tools.
- `npm ci --omit=dev` (no devDeps).
- `.dockerignore` (skip node_modules, .git, tests).
- `USER node` (non-root).
- Order layers for cache (deps before source).

## How
`COPY --from=build` pulls only needed files from earlier stage. Build junk (compilers, devDeps) stays behind.

## Why
Smaller image = faster deploy/pull, less attack surface, lower cost. Big win for Node/React.

## Where / Scenario
- Prod Docker images for CI/CD.
- React static build → nginx.
- Any compiled/bundled app.

## Related
[[Docker-Basics]] · [[Docker-Compose]] · [[Deploy-MERN-on-AWS]]
