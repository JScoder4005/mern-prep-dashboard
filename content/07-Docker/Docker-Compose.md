# Docker Compose

## Q
What is docker-compose? When use it? Networks + volumes between services.

## A
Compose = define + run multi-container apps from one YAML. `docker compose up` starts all services (app + db + cache) with one command, on a shared network.

## Code
Full MERN stack:
```yaml
services:
  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/app   # 'mongo' = service DNS name
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis

  client:
    build: ./client
    ports:
      - "3000:80"

  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db      # persist DB
    ports:
      - "27017:27017"

  redis:
    image: redis:alpine

volumes:
  mongo-data:                    # named volume survives restarts
```

Commands:
```bash
docker compose up -d        # start detached
docker compose down         # stop + remove
docker compose logs -f api  # follow one service
docker compose ps
docker compose build
```

## How
Compose creates a default **network** — services reach each other by service name (`mongo`, `redis`) as hostname (built-in DNS). Named **volumes** persist data across `down`/`up`.

## Why
One command spins up whole stack. Reproducible local dev env matching prod. No manual `docker run` per service + networking.

## Where / Scenario
- Local dev: run API + Mongo + Redis together.
- Integration tests.
- Small prod / staging (or compose → k8s in bigger setups).

## Related
[[Docker-Basics]] · [[Multi-Stage-Build]]
