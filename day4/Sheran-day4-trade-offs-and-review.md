# GreenChit — Trade-offs and Design Review

---

# Setup

Two architectural options were reviewed for the GreenChit reimbursement management system.

| Option | Description |
|---|---|
| Option A | Azure App Service monolith architecture |
| Option B | Azure Container Apps split-service architecture |

The comparison focused on quality attributes that directly impact the business and engineering team, including deployment speed, operational complexity, scalability, authentication consistency, and infrastructure cost.

---

# Trade-off Table

| Quality Attribute | Option A: App Service Monolith | Option B: Container Apps Split | Why |
|---|---|---|---|
| Time-to-first-deploy | 5 | 2 | App Service provides a faster and simpler deployment process with fewer infrastructure components |
| Cost (low spend) | 5 | 2 | App Service has lower operational and infrastructure costs for small internal systems |
| Operability for 10-person team | 4 | 3 | Smaller teams can maintain a monolith more easily than distributed container services |
| Independent deploy | 1 | 5 | Container Apps allow each service to be deployed independently without redeploying the full system |
| Future scaling | 2 | 5 | Split container services scale independently and support future workload growth |
| Authn/authz consistency | 4 | 3 | A monolith centralizes authentication and authorization management more easily |
| Total | 21 | 20 | App Service monolith slightly preferred for current project scope and team maturity |

---

# Results Summary

| Metric | Target | Achieved |
|--------|--------|----------|
| Quality attributes scored | 6 | 6 |
| Cells with a written justification | 12 | 12 |
| Decision-affecting attributes identified | 2-3 | 2 |

---

# Decision and Rationale

Option A (Azure App Service monolith architecture) was selected for GreenChit because the business currently prioritizes faster delivery, lower operational complexity, and reduced infrastructure management overhead over independent service scaling. Although Azure Container Apps provide stronger long-term scalability and deployment flexibility, the expected workload, smaller engineering team, and internal business scope make Azure App Service a more practical and lower-risk solution for the initial release.

The two primary quality attributes that drove the final decision were:

- Faster deployment and reduced operational complexity
- Lower infrastructure and maintenance cost

---

# Design Review Feedback (Received from Another Pair)

## Strengths

- Clear separation between frontend, backend, storage, and notification services
- Good use of Azure Service Bus for asynchronous notification handling
- Consistent naming and protocol labeling across diagrams

## Weaknesses or Risks

- Receipt upload retry strategy was not clearly explained
- Audit log tamper-evidence implementation details were limited
- Teams notification failure handling was not fully described

## Actionable Improvements

- Add retry logic explanation in the sequence diagram failure path
- Add an additional ADR describing audit log integrity and retention strategy

---

# Design Review Feedback (Given to Another Pair)

## Strengths

- Well-structured container diagram with readable system boundaries
- Good separation between approval workflow and payroll export process
- Appropriate use of Azure-managed services for reliability and scalability

## Weaknesses or Risks

- Some diagram arrows were missing communication protocols
- Database backup and disaster recovery approach was unclear
- Notification architecture lacked fallback handling explanation

## Actionable Improvements

- Add protocol labels such as HTTPS, SQL, and AMQP to all interactions
- Add a short reliability section describing backup and recovery strategy
