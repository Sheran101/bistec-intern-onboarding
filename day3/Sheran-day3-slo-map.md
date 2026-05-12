# BookSwap — SLI/SLO Map

## 1. NFR inventory

| # | NFR | User-visible behaviour |
|---|-----|------------------------|
| 1 | Catalogue search: 99% of requests under 800 ms over rolling 28 days, even at 10× RPS | Users can search books quickly during normal and spike traffic |
| 2 | Listing creation: 99.9% success rate | Users can add new book listings reliably |
| 3 | Failed listing attempts must be retryable without duplicate listings | Users can retry safely if listing creation fails |
| 4 | Every endpoint except `/health` requires a valid JWT | Only logged-in users can use protected API features |
| 5 | Complete outage of listings endpoint pages on-call within 3 minutes | Operations team is alerted quickly when listing service is down |
## 2. SLI / SLO table

| # | SLI definition | Measurement source | SLO target | Window | Error budget |
|---|---|---|---|---|---|
| 1 | Percentage of GET /books search requests returning success within 800 ms | Azure Application Insights requests table | 99% under 800 ms | Rolling 28 days | 1% slow or failed requests |
| 2 | Percentage of POST /books listing creation requests returning 2xx/201 successfully | Azure Application Insights requests table | 99.9% success | Rolling 28 days | 0.1% failed requests |
| 3 | Percentage of retry listing requests using Idempotency-Key that do not create duplicate listings | Azure SQL logs + App Insights traces | 100% no duplicate listings | Rolling 28 days | 0 duplicate listings allowed |
| 4 | Percentage of protected endpoints rejecting missing or invalid JWT tokens | App Insights traces and API logs | 100% protected except /health | Rolling 28 days | 0 unprotected endpoints |
| 5 | Time from complete GET /books outage to on-call alert fired | Azure Monitor alert rule | Alert within 3 minutes | Per incident | Maximum 3 minutes detection time |
| 6 | Percentage of important user actions successfully logged for auditing | Azure Monitor Logs / App Insights traces | 100% logged | Rolling 28 days | 0 missing audit logs |
## 3. Error budget policy

- If the search SLO error budget is exhausted, the team stops releasing new search features and focuses only on performance fixes.
- If listing creation SLO is exhausted, the team stops feature work on listings and fixes database, retry, and idempotency issues first.
- If security or audit SLOs fail, releases are blocked until the issue is fixed because private member data and audit logs are business-critical.
- The engineering lead and operations lead own the final decision to pause releases and start halt-and-fix work.

## 4. Out of budget right now

The SLO I would bet we cannot meet today is **search latency under 800 ms at 10× traffic**, because the current design depends heavily on Azure SQL and Redis cache performance, and we have not yet proven it using load testing.