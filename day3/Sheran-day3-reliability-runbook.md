# BookSwap — Reliability Runbook v0.1

---

# Failure 1: Azure SQL primary unavailable for 5 minutes

## What the user sees

- Users may experience slow responses when searching books
- Listing creation may temporarily fail
- Loan requests may not complete successfully
- Some pages may show “Service temporarily unavailable”

---

## Detection

### Azure Metrics / Alerts

- Azure SQL Database availability metric
- Application Insights dependency failures
- HTTP 5xx error rate increase

### Alert Rule

```text
requests
| where success == false
| summarize failures = count() by bin(timestamp, 1m)
```

### Trigger

- Alert fires if failed SQL dependency calls exceed 20 per minute for 3 consecutive minutes

---

## Mitigation in design

### Retry Configuration

```text
Retries: 3
Backoff: 200ms, 400ms, 800ms
Timeout per request: 2 seconds
```

### Circuit Breaker

```text
Open circuit after 5 consecutive SQL failures
Keep circuit open for 30 seconds
```

### Fallback Behaviour

- Cached search results are served from Redis if available
- Listing creation requests are rejected safely with retry guidance
- Read-only operations continue where possible

### Idempotency Protection

- `POST /books` requires `Idempotency-Key`
- Duplicate retries do not create multiple listings

---

## Manual response

### Who is paged

- On-call backend engineer
- Azure operations engineer

### What they do

1. Check Azure SQL status in Azure Portal
2. Confirm if failover is happening
3. Review dependency failures in Application Insights
4. Verify App Service retry behaviour
5. Temporarily scale Azure SQL resources if needed
6. Inform support team about degraded service

---

## Post-incident actions

- Review SQL failover duration
- Tune retry/backoff configuration
- Improve database indexes for recovery performance
- Run disaster recovery simulation again

---

# Failure 2: Azure Cache for Redis is down

## What the user sees

- Search becomes slower than normal
- Pages still work but may load with higher latency
- No data loss occurs

---

## Detection

### Azure Metrics / Alerts

- Redis cache availability metric
- Redis connection failures
- Increased SQL query count

### Alert Rule

```text
dependencies
| where target contains "redis"
| where success == false
| summarize failures = count() by bin(timestamp, 1m)
```

### Trigger

- Alert fires if Redis dependency failures exceed 10 per minute for 2 minutes

---

## Mitigation in design

### Fallback Strategy

- Search requests automatically fall back to Azure SQL
- System continues serving results without cache

### Retry Configuration

```text
Retries: 2
Backoff: 100ms, 200ms
Timeout: 500ms
```

### Circuit Breaker

```text
Open after 5 Redis failures
Keep open for 60 seconds
```

### Protection During Fallback

- Rate limiting enabled at Azure Front Door
- Search pagination limited during outage
- Expensive queries throttled

---

## Manual response

### Who is paged

- On-call backend engineer

### What they do

1. Check Azure Cache for Redis health
2. Review Redis connection metrics
3. Confirm SQL fallback is working
4. Scale Azure SQL if traffic increases
5. Restart Redis connection pool if required

---

## Post-incident actions

- Review cache warm-up strategy
- Improve fallback query optimization
- Add additional cache monitoring dashboards

---

# Failure 3: Sunday tabloid spike — 10× sustained traffic

## What the user sees

- Slightly slower search responses during peak traffic
- Some requests may receive rate-limit responses
- Listing creation continues working reliably

---

## Detection

### Azure Metrics / Alerts

- Request rate (RPS)
- CPU and memory usage
- Queue depth in Azure Service Bus
- App Service autoscale events

### Alert Rule

```text
requests
| summarize totalRequests = count() by bin(timestamp, 1m)
```

### Trigger

- Alert fires if request volume exceeds 10× baseline traffic for 5 minutes

---

## Mitigation in design

### Autoscaling

```text
Scale out App Service instances when:
CPU > 70% for 5 minutes
Maximum instances: 10
Minimum instances: 2
```

### Queue Protection

- Notification jobs handled asynchronously using Azure Service Bus
- Email digests processed separately from user requests

### Rate Limiting

- Azure Front Door rate limiting enabled
- Login and write endpoints protected first

### Retry and Timeout

```text
Retries: 3
Backoff: 200ms, 400ms, 800ms
Request timeout: 3 seconds
```

### Throttling

- Search page size capped during spike traffic
- Non-critical background jobs delayed temporarily

---

## Manual response

### Who is paged

- Operations engineer
- Backend engineer

### What they do

1. Monitor autoscaling behaviour
2. Check App Service CPU and memory
3. Monitor Service Bus queue depth
4. Confirm search latency remains below SLO target
5. Increase App Service instances manually if autoscale is insufficient

---

## Post-incident actions

- Review autoscaling effectiveness
- Compare actual traffic against forecast
- Optimize expensive SQL queries
- Improve Redis cache warm-up before future events