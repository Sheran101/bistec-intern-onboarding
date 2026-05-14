# ADR 0004: Store Receipts in Azure Blob Storage with Virus Scan Validation

## Status

Accepted (date: 2026-05-14)

---

## Context

- Employees upload receipt image files during reimbursement submission
- Files may reach up to 10 MB each
- Up to 5 files can be uploaded per claim
- Financial systems require secure file handling
- Upload failures must not corrupt claim workflows
- Malware or unsafe file uploads present security risks

---

## Decision

We will store receipt files in Azure Blob Storage using signed URL upload access.

Uploaded files will be validated and scanned before permanent association with claims.

Blob Storage will store only receipt files, while metadata references will remain in Azure SQL Database.

---

## Consequences

### Easier

- Blob Storage is optimized for secure file storage
- Signed URLs reduce direct backend file handling overhead
- Receipt uploads scale independently from the database

### Harder

- File upload workflows become more complex than simple database storage
- Virus scanning introduces additional processing steps and operational management
- Upload rollback handling must be implemented carefully

### Different

- File storage is separated from structured claim data to improve scalability and storage efficiency

---

## Alternatives Considered

### Store receipt images directly inside Azure SQL Database

Rejected because storing large binary files inside SQL increases storage cost and reduces database performance.

### Local server file storage

Rejected because local storage reduces scalability, reliability, and cloud-native disaster recovery capabilities.