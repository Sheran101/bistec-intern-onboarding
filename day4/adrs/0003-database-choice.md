# ADR 0003: Use Azure SQL Database for Claim Storage

## Status

Accepted (date: 2026-05-14)

---

## Context

- GreenChit stores structured reimbursement claim data
- Claims contain relationships between employees, managers, approvals, statuses, and audit records
- Financial records require transactional consistency
- The engineering team has stronger relational database experience than NoSQL experience
- Audit logging and reporting require structured querying capabilities

---

## Decision

We will use Azure SQL Database as the primary persistence layer for GreenChit.

Azure SQL Database will store:

- Claims
- User information
- Approval records
- Audit logs
- Claim statuses

Blob Storage will be used separately for receipt image files.

---

## Consequences

### Easier

- Relational data modeling is straightforward for claim workflows
- SQL queries simplify reporting and audit retrieval
- Transaction consistency improves financial data reliability

### Harder

- Horizontal scaling flexibility is lower than some NoSQL solutions
- Schema changes require migration management
- Large-scale distributed workloads may require future redesign

### Different

- The system prioritizes relational consistency and reporting simplicity over schema flexibility

---

## Alternatives Considered

### Azure Cosmos DB

Rejected because GreenChit primarily handles structured relational data with transactional requirements rather than large-scale schema-flexible workloads.

### File-based storage only

Rejected because reimbursement workflows require searchable structured records and audit capabilities.