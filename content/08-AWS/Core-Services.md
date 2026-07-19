# AWS Core Services

## Q
Explain core AWS services you'd use for a MERN app. EC2 vs Lambda? RDS vs DynamoDB?

## A
Know breadth: compute, storage, DB, networking, identity, CDN. Pick per need.

## Cheat sheet
| Service | What | Use |
|---|---|---|
| **EC2** | virtual server | run Node backend, full control |
| **S3** | object storage | static files, uploads, React build hosting |
| **IAM** | identity/permissions | roles, least-privilege policies |
| **RDS** | managed SQL (Postgres/MySQL) | relational data |
| **DynamoDB** | managed NoSQL (key-value) | high-scale, serverless |
| **Lambda** | serverless functions | event-driven, no server mgmt |
| **API Gateway** | HTTP front for Lambda | serverless REST API |
| **CloudFront** | CDN | cache/serve static globally |
| **ECS/ECR** | run/store Docker containers | containerized deploy |
| **VPC** | private network | isolate resources |
| **ELB** | load balancer | distribute traffic |
| **Route 53** | DNS | domain routing |
| **Secrets Manager / SSM** | secrets/config | env vars, DB creds |
| **SQS/SNS** | queue / pub-sub | async, decouple |
| **CloudWatch** | logs/metrics/alarms | monitoring |

## EC2 vs Lambda
| | EC2 | Lambda |
|---|---|---|
| Model | always-on server | per-request function |
| Scale | manual/ASG | auto, instant |
| Cost | per hour | per invocation |
| Cold start | none | yes |
| Use | steady load, long tasks, WebSockets | spiky/event-driven, short tasks |

## RDS vs DynamoDB
- **RDS** — relational, joins, transactions, SQL. Known schema.
- **DynamoDB** — massive scale, single-digit ms, key-value/access-pattern-first. No joins.

## Security basics
- IAM **least privilege** (only needed perms).
- Never hardcode keys → use IAM roles / Secrets Manager.
- Security groups = firewall (open only needed ports).
- Private subnets for DB.

## Where / Scenario
- MERN classic: EC2/ECS (API) + S3+CloudFront (React) + Mongo Atlas/DocumentDB + Secrets Manager.
- Serverless: Lambda + API Gateway + DynamoDB.

## Related
[[Deploy-MERN-on-AWS]] · [[S3-Presigned-URL]]
