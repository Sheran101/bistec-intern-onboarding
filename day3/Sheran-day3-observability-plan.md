# BookSwap — Observability Plan

---

# Setup

## Logs

### Platform

- Azure Monitor Logs
- Azure Application Insights traces

### Retention

- Logs retained for 30 days
- Security audit logs retained for 90 days

### Redaction Rules

The following sensitive data must never be logged:

- JWT tokens
- Passwords
- Member addresses
- Payment or secret credentials

### Logged Security Events

- Authentication failures
- Loan creation events
- Loan return events
- Failed authorization attempts

---

## Metrics

### Platform

- Azure Application Insights metrics
- Azure App Service metrics
- Azure SQL metrics
- Azure Cache for Redis metrics
- Azure Service Bus metrics

### Monitored Metrics

| Metric | Purpose |
|---|---|
| Search latency p95 | Monitor search performance |
| Listing creation success rate | Monitor reliability |
| HTTP 5xx rate | Detect application failures |
| CPU and memory usage | Detect scaling issues |
| Redis availability | Detect cache outages |
| Queue depth | Detect delayed background processing |

---

## Traces

### Distributed Tracing

Application Insights distributed tracing is enabled to track:

- API requests
- SQL queries
- Redis calls
- Service Bus operations

### Trace Sampling

```text
Sampling Rate: 10%
Critical errors: 100% captured
```

---

# Signal Coverage Table

| # | Signal type | Source | What it answers | Sample query / metric |
|---|---|---|---|---|
| 1 | Metric | Application Insights | Are searches staying under latency SLO? | `requests | summarize percentile(duration,95)` |
| 2 | Metric | Application Insights | Is listing creation succeeding? | `requests | where name == "POST /books"` |
| 3 | Log | App Insights traces | Which authentication attempts failed? | `traces | where customDimensions.event == "auth.failed"` |
| 4 | Trace | Application Insights | Which dependency caused slow requests? | Distributed trace timeline |
| 5 | Metric | Azure Service Bus | Are background jobs delayed? | Queue depth metric |
| 6 | Metric | Azure SQL | Is SQL dependency healthy? | Failed dependency count |
| 7 | Metric | Azure Cache for Redis | Is Redis available? | Redis connection failures |
| 8 | Log | Azure Monitor Logs | Were loan actions audited correctly? | Loan event trace query |

---

# Example Queries

## Search Latency p95

```kusto
requests
| where name == "GET /books"
| summarize percentile(duration, 95) by bin(timestamp, 1m)
```

---

## Listing Creation Success Rate

```kusto
requests
| where name == "POST /books"
| summarize successRate = 100.0 * countif(success == true) / count()
```

---

## Authentication Failures

```kusto
traces
| where customDimensions.event == "auth.failed"
```

---

## Redis Dependency Failures

```kusto
dependencies
| where target contains "redis"
| where success == false
```

---

# Results Summary

| Metric | Target | Achieved |
|---|---|---|
| SLOs covered by alerts | 100% | 100% |
| Alerts with runbook links | 100% | 100% |
| Dashboards for operations | 2 dashboards | 2 dashboards |

---

# Dashboards

## Health Dashboard

Displays:

- API latency
- HTTP 5xx rate
- SQL dependency health
- Redis availability
- Queue depth
- Active alerts

## Business Dashboard

Displays:

- Book searches per minute
- New listings created
- Loan creation count
- Login success/failure trends

---

# Alert Proposal

| Alert | Condition | Severity | Notification | Runbook |
|---|---|---|---|---|
| Search SLO burn | Error rate > 1% over 5 min | Sev2 | Pager + Teams | `reliability/runbook.md#failure-3` |
| Listings endpoint outage | 100% failure for 3 min | Sev1 | Pager + SMS | `reliability/runbook.md#failure-1` |
| Redis unavailable | Redis failures exceed threshold | Sev2 | Teams | `reliability/runbook.md#failure-2` |
| Queue backlog | Queue depth > 1000 messages | Sev3 | Teams | `reliability/runbook.md#failure-3` |
| Authentication attack | Login failures spike rapidly | Sev2 | Pager + Teams | `security/review.md` |
| High SQL dependency failures | SQL failures exceed threshold | Sev1 | Pager + SMS | `reliability/runbook.md#failure-1` |

---

# Alert Severity Levels

| Severity | Meaning |
|---|---|
| Sev1 | Critical outage affecting users |
| Sev2 | Major degradation requiring urgent attention |
| Sev3 | Minor issue requiring investigation |

---

# What we are deliberately NOT alerting on

1. Single failed requests because occasional transient failures are expected
2. Individual slow queries below SLO thresholds because they do not impact overall user experience
3. Low queue spikes under temporary traffic bursts because autoscaling handles short increases automatically

---

# Observability Goals

The observability system is designed to ensure:

- Operations team can confirm system health within 5 minutes
- All major SLOs are measurable
- Security-related events are auditable
- Distributed tracing identifies slow dependencies quickly
- PII is protected before telemetry storage

---

# Overall Assessment

The proposed observability plan provides coverage across metrics, logs, and traces using Azure-native tooling. Alerts are mapped directly to business-critical SLOs, while telemetry redaction protects sensitive user information. The design supports rapid outage detection, operational visibility, and scalable monitoring during high traffic events.