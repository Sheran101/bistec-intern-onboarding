# Sequence — Submit and Approve a Claim

## Happy path and error path

```mermaid
sequenceDiagram
  participant U as Claimant
  participant FE as Web App
  participant API as Claims API
  participant DB as Azure SQL Database
  participant BLOB as Azure Blob Storage
  participant SB as Azure Service Bus
  participant TEAMS as Microsoft Teams Webhook
  participant MGR as Line Manager

  U->>FE: Tap Submit Claim
  FE->>API: POST /claims with JWT / HTTPS
  API->>DB: INSERT claim status=Submitted / SQL

  alt Receipt upload successful
    API->>BLOB: Upload receipts using signed URLs / HTTPS
    API->>DB: INSERT audit row / SQL
    API-->>SB: Publish claim.submitted event / AMQP
    SB-->>TEAMS: Send approval card / HTTPS
    TEAMS-->>MGR: Notify approval request / Teams
    MGR->>API: POST /claims/{id}/approve with JWT / HTTPS
    API->>DB: UPDATE claim status=Approved / SQL
    API->>DB: INSERT audit row / SQL
    API-->>MGR: 200 OK Approved / HTTPS
  else Receipt upload fails
    API->>DB: UPDATE claim status=Draft reason=upload_failed / SQL
    API->>DB: INSERT audit row for upload failure / SQL
    API-->>FE: 502 Bad Gateway with Retry-After / HTTPS
    FE-->>U: Show upload failed message / HTTPS
  end
```

## Notes

This sequence diagram shows the full submit-and-approve journey for GreenChit. The happy path starts when the claimant submits a reimbursement claim through the Web App. The Claims API stores the submitted claim, uploads receipt images to Azure Blob Storage, records an audit row, publishes a notification event to Azure Service Bus, and sends an approval request to the manager through Microsoft Teams. The manager then approves the claim, and the Claims API updates the claim status to Approved.

The error path shows what happens if receipt upload fails after the claim has already been created. In that case, the Claims API changes the claim back to Draft, records the failure in the audit log, and returns a retry message to the Web App.