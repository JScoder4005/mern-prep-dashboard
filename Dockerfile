# syntax=docker/dockerfile:1

# ── deps ── install dependencies (its own layer, cached unless the lockfile changes)
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate
# Copy only manifests first so `pnpm install` is cached when source (not deps) changes.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── builder ── build the Next.js app into .next/standalone
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ── runner ── minimal production image (no dev deps, no source, non-root)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user (security best practice).
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -S nextjs

# Standalone output = self-contained server + only the node_modules it needs.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Notes are read at build time; copied too so any fs read still works at runtime.
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
