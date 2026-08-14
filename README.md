# Cloud Resume Challenge + Visitor Analytics

A personal portfolio/resume site built on the [Cloud Resume Challenge](https://cloudresumechallenge.dev/) structure, extended with a serverless visitor analytics pipeline. Fully infrastructure-as-code via Terraform, with automated testing and CI/CD.

**Live site:** [https://micotazarte.dev](https://micotazarte.dev)

---

## Overview

This isn't just a static resume site — it's a working example of a small, real-world AWS architecture, entirely serverless, entirely defined in code. Every visit to the site is logged, a scheduled job computes daily analytics from that raw data, and the whole stack — from DNS to Lambda permissions — is managed through Terraform rather than manual console changes.

## Architecture

```
Visitor
  │
  ▼
CloudFront (custom domain via ACM, OAC-secured origin)
  │
  ├── Static assets ──► S3 (private bucket, no public access)
  │
  └── API calls ──► API Gateway (HTTP API)
                       ├── POST /log-visit ──► Lambda: logVisit ──► DynamoDB: VisitLogs
                       └── GET  /analytics ──► Lambda: getAnalytics ──► DynamoDB: SiteAnalytics

EventBridge (daily cron)
  └──► Lambda: computeAnalytics ──► scans VisitLogs, writes summary + dated snapshot to SiteAnalytics
```

**Frontend:** React (Vite) + Tailwind v4
**Hosting:** S3 (private) + CloudFront, secured via Origin Access Control (OAC)
**Backend:** Lambda (Python 3.14) + DynamoDB + API Gateway (HTTP API)
**Scheduling:** EventBridge cron, daily analytics rollup
**IaC:** Terraform — every resource in this architecture is defined and imported into Terraform state
**CI/CD:** GitHub Actions — frontend build, Python test suite, S3 deploy, CloudFront invalidation
**DNS/TLS:** Custom domain via name.com DNS + AWS Certificate Manager

## Features

- **Visitor logging** — every page load records a visit (timestamp, referrer) to DynamoDB.
- **Daily analytics rollup** — a scheduled Lambda scans all visit logs once a day and computes total visits, a day-by-day breakdown, top referrers, and a z-score-based anomaly flag (detects unusually high/low traffic days).
- **Historical snapshots** — alongside the live summary, each day's computed analytics are also stored as a separate dated snapshot, so trends over time aren't lost to the next day's overwrite.
- **Custom domain with HTTPS** — served over `micotazarte.dev` with a CloudFront-attached ACM certificate, SNI-based TLS.
- **Fully imported Terraform state** — this project didn't start as code. It was built manually first, then every resource — IAM roles, Lambda functions, API Gateway routes, the CloudFront distribution, EventBridge rules — was individually imported into Terraform, so `terraform plan` now reflects a 1:1 match with real infrastructure.
- **Automated tests, CI-enforced** — all three Lambda functions have a pytest suite (using `moto` to mock DynamoDB), running in GitHub Actions on every push. A failing test blocks the frontend deploy.

## A security fix worth mentioning

During the Terraform import process, importing the S3 bucket's policy surfaced a leftover `PublicReadGetObject` statement with `Principal: "*"` — a public-read grant that let anyone fetch objects directly from the S3 bucket, completely bypassing CloudFront and the OAC restriction it was supposed to enforce. This wasn't something that showed up in normal browsing (CloudFront still worked fine), which is exactly what made it easy to miss.

It was removed via Terraform, and verified by confirming a direct S3 URL now returns `AccessDenied`, while the CloudFront domain continues to serve the site normally.

## Repository structure

```
.
├── lambda-src/              # Source of truth for Lambda code
│   ├── logVisit/
│   ├── computeAnalytics/
│   └── getAnalytics/
├── terraform/
│   ├── main.tf               # Provider config
│   ├── s3.tf                 # Bucket, policy, public access block
│   ├── dynamodb.tf           # VisitLogs, SiteAnalytics tables
│   ├── iam.tf                # Roles, policies, attachments
│   ├── lambda.tf             # Lambda functions
│   ├── api_gateway.tf        # HTTP API, routes, integrations, permissions
│   ├── cloudfront.tf         # Distribution, OAC
│   ├── eventbridge.tf        # Daily analytics cron
│   └── lambda-code/          # Built .zip deployment packages
├── tests/                    # pytest suite (moto-mocked DynamoDB)
├── src/                      # React frontend
└── .github/workflows/        # CI/CD pipeline
```

## Infrastructure as Code

All infrastructure is managed through Terraform — no manual console changes are made against this account. The workflow is: edit a `.tf` file → `terraform plan` → review the diff → `terraform apply`. Every resource currently running in AWS was individually imported into state, verified against a clean `terraform plan`, and is now version-controlled.

## Testing

```bash
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements-dev.txt
pytest tests/ -v
```

Tests use [`moto`](https://github.com/getmoto/moto) to fully mock DynamoDB, so they run without touching real AWS resources or requiring credentials.

## CI/CD

On every push to `main`:

1. **`build-and-test`** — installs frontend dependencies, builds the React app
2. **`test-lambdas`** — runs the Python test suite against all three Lambda functions
3. **`deploy-frontend`** *(only after both jobs above pass)* — syncs the built frontend to S3 and invalidates the CloudFront cache

## Roadmap

- [ ] Admin-gated analytics dashboard (password-protected `/admin` route with a Recharts visualization of the analytics data)
- [ ] CloudWatch alarms for Lambda errors and latency
- [ ] Scope remaining broad IAM permissions further where possible
