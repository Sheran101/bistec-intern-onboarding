# BookSwap — Security Review

## Security Review Summary

This review evaluates the BookSwap API security posture based on authentication, authorization, secrets management, transport security, rate limiting, injection protection, and PII handling. The system uses Azure App Service, Azure SQL, Azure Front Door, Azure Key Vault, Azure Cache for Redis, and Azure Application Insights.

---

# Security Findings Table

| Category | Question | Finding | Severity | Mitigation |
|---|---|---|---|---|
| Authn | Is every non-public endpoint protected by JWT? | Most endpoints require JWT authentication except `/health`. JWT validation middleware is required on all protected routes. | Medium | Apply authentication middleware globally and exclude only `/health`. |
| Authz | Does every `/{id}` endpoint check ownership? | Potential Broken Object Level Authorization (BOLA) risk if member ID ownership is not validated against JWT identity. | High | Validate JWT member ID against requested resource owner before returning data. |
| Injection | Are all DB queries parameterised? | SQL queries use parameterized statements which reduces SQL injection risk. | Low | Continue enforcing prepared statements and ORM validation rules. |
| Secrets | Where are connection strings stored? | Production secrets are stored in Azure Key Vault instead of `.env` files. | Low | Restrict Key Vault access using managed identities and RBAC. |
| Transport | Is TLS enforced at Front Door? | HTTPS/TLS is enforced through Azure Front Door before requests reach App Service. | Low | Redirect all HTTP traffic to HTTPS automatically. |
| Rate limit | Are auth and write endpoints rate-limited? | Login and listing creation endpoints currently require stronger rate limiting during traffic spikes. | Medium | Configure Azure Front Door WAF rate limiting policies. |
| PII | What PII appears in responses, logs, or queues? | Member addresses and loan history may accidentally appear inside logs or traces. | High | Redact sensitive fields before logging telemetry data. |

---

# Broken Object Level Authorization (BOLA) Scenario

## Example Risk

### Request

```http
GET /members/452/loans
Authorization: Bearer eyJhbGci...
```

### Problem

A malicious user could manually change the member ID in the URL and access another member’s loan history if ownership validation is missing.

### Impact

- Exposure of private borrowing history
- Exposure of member personal information
- Privacy and compliance violations

### Severity

High

### Mitigation

- Validate the member ID in JWT against the requested resource ID
- Reject unauthorized access with HTTP 403 Forbidden
- Add authorization middleware on all member-specific endpoints

---

# PII Exposure Risk

## Identified PII

- Member addresses
- Loan history
- Email addresses
- Authentication failure metadata

## Risk

Sensitive user information may accidentally appear in:

- Application logs
- Azure Monitor traces
- Queue payloads
- Error responses

## Mitigation

- Mask addresses and email values before logging
- Never log JWT tokens
- Redact sensitive fields inside Application Insights telemetry
- Limit queue payloads to non-sensitive identifiers only

---

# Rate Limiting Review

## Sensitive Endpoints

| Endpoint | Risk |
|---|---|
| `POST /auth/login` | Brute-force login attempts |
| `POST /books` | Spam listing creation |
| `POST /loans` | Abuse of borrowing requests |

## Mitigation

- Azure Front Door WAF rate limiting
- Per-IP request throttling
- CAPTCHA for repeated login failures
- Temporary account lock after repeated failed logins

---

# Authentication Review

## JWT Requirements

- All endpoints except `/health` require JWT
- Tokens expire within 1 hour
- Expired tokens return HTTP 401 Unauthorized

## Recommendations

- Use short token expiry
- Rotate signing secrets regularly
- Store signing secrets in Azure Key Vault

---

# SQL Injection Review

## Current Protection

- Parameterized SQL queries
- ORM validation
- Input validation on API requests

## Example Safe Query

```sql
SELECT * FROM books WHERE id = ?
```

## Recommendation

- Continue using parameterized queries only
- Reject raw SQL string concatenation

---

# Transport Security Review

## Current Protection

- TLS enforced at Azure Front Door
- HTTPS-only communication
- Secure connection between Azure services

## Recommendations

- Disable insecure TLS versions
- Enable HSTS headers
- Redirect all HTTP requests to HTTPS

---

# OWASP ZAP Baseline Scan Review

## Scan Target

```text
http://host.docker.internal:4010
```

## Findings Discussed

| Finding | Severity | Notes |
|---|---|---|
| Missing security headers | Medium | Some responses may miss security-related HTTP headers |
| Server version disclosure | Low | Response headers may expose framework details |
| Missing rate limiting indicators | Medium | Sensitive endpoints do not clearly enforce request throttling |

## Mitigation

- Add secure HTTP headers
- Hide unnecessary server information
- Apply WAF-based rate limiting policies

---

# Security Recommendations

1. Enforce authorization checks on all member-owned resources
2. Apply stronger rate limiting for login and write APIs
3. Redact sensitive data before logging
4. Enable secure headers through Azure Front Door
5. Continue using Azure Key Vault for all secrets
6. Add automated security testing in CI/CD pipeline

---

# Overall Assessment

The BookSwap architecture follows several good security practices including JWT authentication, Azure Key Vault secret management, TLS enforcement, and parameterized SQL queries. However, authorization validation, PII redaction, and rate limiting require stronger enforcement before production deployment at large scale.