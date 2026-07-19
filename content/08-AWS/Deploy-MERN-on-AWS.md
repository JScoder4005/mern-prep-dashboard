# Deploy MERN on AWS

## Q
Walk through deploying a MERN app on AWS end to end.

## A
Frontend (React) → S3 + CloudFront. Backend (Node) → EC2 or ECS behind a load balancer. DB → Mongo Atlas / DocumentDB. Secrets → Secrets Manager. CI/CD → GitHub Actions.

## Architecture
```
User
  |
Route 53 (DNS)
  |
CloudFront (CDN, HTTPS)
  |-- /            -> S3 bucket (React static build)
  |-- /api/*       -> ALB -> ECS/EC2 (Node/Express)
                              |
                              +-- Mongo Atlas / DocumentDB
                              +-- Secrets Manager (DB creds, JWT secret)
                              +-- CloudWatch (logs/metrics)
```

## Steps
Frontend:
```bash
npm run build
aws s3 sync build/ s3://my-app-bucket
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```
- S3 static website hosting or private + CloudFront OAC.
- CloudFront = HTTPS + global cache + custom domain.

Backend (containerized):
```bash
docker build -t myapi .
aws ecr get-login-password | docker login --username AWS --password-stdin <ecr>
docker tag myapi <ecr>/myapi:latest
docker push <ecr>/myapi:latest
# ECS Fargate service pulls image, runs behind ALB
```
- ALB routes `/api/*`, terminates HTTPS, health checks.
- Auto Scaling on CPU/requests.
- Env/secrets from Secrets Manager (not in image).

Database:
- Mongo Atlas (managed, easiest) or DocumentDB.
- Whitelist VPC / private networking.

CI/CD (GitHub Actions):
- On push → build → test → build image → push ECR → update ECS service.

## Why each choice
- S3+CloudFront: cheap, fast, scalable static hosting.
- ECS Fargate: containers without managing servers.
- ALB: HTTPS + scaling + health.
- Secrets Manager: no creds in code/image.

## Simpler alternatives (mention in interview)
- Small: EC2 + PM2 + nginx reverse proxy, React on S3.
- Serverless: Lambda + API Gateway + DynamoDB.
- Fastest: Vercel (frontend) + Render/Railway (backend).

## Where / Scenario
Production MERN deploy — this diagram is a strong system-design-lite answer.

## Related
[[Core-Services]] · [[S3-Presigned-URL]] · [[Multi-Stage-Build]] · [[Fundamentals]]
