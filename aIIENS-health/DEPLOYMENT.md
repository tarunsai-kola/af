# AIIENS Health — Deployment Guide

## Production Architecture

```
                    ┌──────────────┐
  Internet ────────▶│  Nginx / ALB │
                    └──────┬───────┘
                           │ X-Forwarded-For
                    ┌──────▼───────┐
                    │  Express API │  (trust proxy = 1)
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌───────────┐ ┌──────────┐ ┌──────────┐
       │  MongoDB  │ │   S3     │ │ Razorpay │
       │  Atlas    │ │  Bucket  │ │  Webhook │
       └───────────┘ └──────────┘ └──────────┘
```

## Secrets Management

**CRITICAL**: Production secrets MUST be injected through a secure secret-management system.
Do NOT use committed `.env` files in production.

Recommended providers:
- AWS Secrets Manager
- HashiCorp Vault
- Google Secret Manager
- Azure Key Vault

### Required Secrets

| Variable | Description | Generation |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | Atlas dashboard |
| `JWT_SECRET` | Access token signing key (≥32 chars) | `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | Refresh token signing key (≥32 chars) | `openssl rand -hex 32` |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature verification | Razorpay dashboard |
| `S3_ACCESS_KEY` | Object storage access key | IAM provider |
| `S3_SECRET_KEY` | Object storage secret key | IAM provider |

### Fail-Fast Behavior

The server validates ALL required environment variables at startup using Zod schemas (`config/env.ts`).
If any required variable is missing or malformed, the server will:
1. Print a clear error message listing the missing variables.
2. Exit immediately with code 1.
3. **Never** start in a partially configured state.

Secret values are NEVER printed in startup logs.

## Reverse Proxy Configuration

Express is configured with `app.set('trust proxy', 1)`.

This means:
- It trusts exactly **one** layer of proxy (your Nginx or ALB).
- `req.ip` correctly reflects the real client IP.
- `express-rate-limit` throttles by real client IP, not the proxy IP.

**Do NOT set `trust proxy` to `true`** — this blindly trusts all `X-Forwarded-For` headers, allowing IP spoofing.

### Nginx Example

```nginx
server {
    listen 443 ssl;
    server_name api.aiiens.org;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
    }
}
```

## Object Storage

Medical documents are stored in a **private S3-compatible bucket**.

- Documents are NEVER publicly accessible.
- Download URLs are presigned with a maximum lifetime of **15 minutes**.
- The presigned URL hard cap is enforced server-side in `S3StorageService.ts`.
- All document access is gated by authentication, RBAC, and case ownership checks.
- Every document access creates an audit event.

### Migration from Local Storage

```bash
# Migrate documents from local disk to S3
npm run migrate:documents

# Migrate and clean up local files after verification
npm run migrate:documents -- --cleanup
```

## Data Retention Classification

| Data Type | Retention | Justification |
|---|---|---|
| **Audit Events** | 7 years (configurable) | Healthcare compliance |
| **Donation Records** | Permanent | Financial/tax records |
| **Medical Documents** | Per case lifecycle | Patient privacy laws |
| **Session/Auth Logs** | 90 days | Operational |
| **Rate Limit Counters** | In-memory only | Ephemeral |

## Database Indexes

All indexes are documented in the respective Mongoose schema files.
Key compound indexes:

- `AuditEvent`: `(objectType, objectId, timestamp)`, `(actorUserId, action, timestamp)`
- `Donation`: `(campaignId, status)`, `(userId, createdAt)`
- `Campaign`: `(status, publishedAt)`
- `PaymentTransaction`: `(status, createdAt)`, `(initiatedBy, status)`
- `MedicalDocument`: `(caseId, documentType, version)`, `(caseId, isArchived)`
