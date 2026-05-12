# BookSwap — Observability Plan

## Setup

- Logs: Azure Monitor Logs and Azure Application Insights traces are used for centralized logging, audit tracking, and operational troubleshooting
- Log retention: General logs are retained for 30 days while security audit logs are retained for 90 days
- Redaction rules: Sensitive information such as JWT tokens, passwords, member addresses, and secret credentials are removed before logging
- Logged events: Authentication failures, loan creation events, loan return events, and authorization failures are captured for auditing and security monitoring

- Metrics: Azure Application Insights metrics are used to monitor request latency, success rate, dependency health, CPU usage, Redis availability, and queue depth
- Monitored metrics include:
  - Search latency p95
  - Listing creation success rate
  - HTTP 5xx error rate
  - CPU and memory usage
  - Redis cache availability
  - Azure Service Bus queue depth

- Traces: Application Insights distributed tracing is enabled to track API requests, SQL queries, Redis calls, and Service Bus operations across the system
- Trace sampling:
  - Normal traffic sample rate: 10%
  - Critical errors captured: 100%

---

## Results Summary

| Metric | Target | Achieved |
|--------|--------|----------|
| SLOs covered by an alert | 100% | 100% |
| Alerts with a clear runbook link | 100% | 100% |
| Dashboards for ops | 1 health, 1 business | 2 dashboards |
| Critical failures monitored | 100% | 100% |
| Security audit events logged | 100% | 100% |

---

## Alert proposal

| Alert | Condition | Severity | Notification | Runbook |
|-------|-----------|----------|--------------|---------|
| Search SLO burn | Error rate > 1% over 5 min | Sev2 | Pager + Teams | reliability/runbook.md#failure-3 |
| Listings endpoint outage | 100% failure for 3 min | Sev1 | Pager + SMS | reliability/runbook.md#failure-1 |
| Redis unavailable | Redis failures exceed threshold | Sev2 | Teams | reliability/runbook.md#failure-2 |
| Queue backlog | Queue depth > 1000 messages | Sev3 | Teams | reliability/runbook.md#failure-3 |
| Authentication attack | Login failures spike rapidly | Sev2 | Pager + Teams | security/review.md |
| High SQL dependency failures | SQL failures exceed threshold | Sev1 | Pager + SMS | reliability/runbook.md#failure-1 |

---

## What we are deliberately NOT alerting on

- Single failed requests because occasional transient failures are expected in distributed systems
- Small queue spikes because autoscaling can handle short traffic increases automatically
- Individual slow queries below SLO thresholds because they do not significantly affect user experience
- Temporary CPU spikes under autoscaling thresholds because short bursts are expected during normal traffic patterns
