# ADR 0002: Host GreenChit on Azure App Service

## Status

Accepted (date: 2026-05-14)

---

## Context

- GreenChit is an internal reimbursement management system
- The engineering team size is approximately 10 people
- The business prioritizes fast delivery and operational simplicity
- Expected traffic is relatively low for the initial release
- Azure hosting is required by the technical constraints
- The system integrates with Azure-managed services such as Blob Storage and Service Bus

---

## Decision

We will host GreenChit using Azure App Service with a monolithic deployment architecture.

The Web App and Claims API will be deployed using Azure App Service, while Azure-managed services will provide storage, messaging, and authentication functionality.

---

## Consequences

### Easier

- Faster deployment and simpler infrastructure management
- Lower operational overhead for a small engineering team
- Easier centralized authentication and monitoring

### Harder

- Independent scaling of individual backend functions is limited
- Deploying small changes may require redeploying the entire application
- Future migration to microservices may require architectural refactoring

### Different

- The system prioritizes simplicity and maintainability over advanced distributed-service scalability

---

## Alternatives Considered

### Azure Container Apps

Rejected because container orchestration and distributed service management introduce additional operational complexity for the current project scale.

### Azure Kubernetes Service (AKS)

Rejected because Kubernetes infrastructure management is unnecessary for the expected workload and team maturity level.