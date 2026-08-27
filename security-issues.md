# Security issues

Defensive review of the DKeramik shop (Next.js static site + Hono API). Live systems were not attacked. This document does not include exploits, payloads, or reproduction steps.

**Status (2026-08-27):** All listed findings are remediated in code and deploy config.

| Severity | Issue | Status |
| --- | --- | --- |
| Critical | Mock payment routes always mounted | Fixed — mock-pay only when provider is mock and store is not Firestore; token required; no public webhook signing |
| High | Weak order validation / mail and stock abuse | Fixed — email/phone/length checks, shipping address required, IP and email rate limits, body size cap |
| High | Duplicate line items oversell | Fixed — quantities merged per product before stock check |
| High | Order tokens in query strings | Fixed — confirmation hash, `X-Order-Token` header, `Referrer-Policy: no-referrer` |
| Medium | Weak admin session | Fixed — constant-time password check, login throttle, `Secure` / `__Host-admin` on HTTPS, CSRF on admin POSTs |
| Medium | `ADMIN_PASSWORD` as Cloud Run env var | Fixed — Secret Manager on deploy |
| Medium | Webhook amount / idempotency | Fixed — finite integer cents; callback id in the same paid transaction |
| Medium | Incomplete HTML escaping | Fixed — quotes encoded |
| Medium | No rate / body limits | Fixed — limiters + 64KB body cap |
| Medium | Invoice GCS public access | Fixed — deploy enforces uniform access + public-access prevention |
| Medium | Default secrets on Firestore | Fixed — process refuses to start |
| Low | SVG injected as HTML | Fixed — `<img src="data:image/svg+xml,…">` |
| Low | Missing security headers | Fixed — API middleware + shop CSP/referrer meta + `public/_headers` |
| Low | Container runs as root | Fixed — `USER node` in Dockerfile |

Unpaid orders older than 7 days are cancelled and restocked. The public README no longer advertises the production admin URL. Paysera checkout still uses MD5 because that is Paysera's protocol.
