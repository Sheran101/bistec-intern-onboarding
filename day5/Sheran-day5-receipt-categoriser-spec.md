# Receipt Categoriser — Feature Spec v0.1

# 1. Why

The GreenChit claims system currently requires claimants to manually select an expense category when submitting receipts. This process can be slow and inconsistent, especially when users upload multiple receipts during reimbursement submission.

The Receipt Categoriser feature aims to reduce claimant effort and improve categorisation consistency by automatically suggesting an expense category based on receipt contents extracted through OCR and analysed using Azure OpenAI.

This feature is expected to improve:

- Claim submission speed
- Accuracy of expense categorisation
- Consistency in finance reporting
- User experience during reimbursement submission

Expected measurable outcomes:

- Reduce average receipt categorisation time by at least 50%
- Achieve suggestion accuracy above 80% during pilot usage
- Keep categorisation response time below 4 seconds p95

---

# 2. Scope

## In Scope

- OCR extraction of uploaded receipt images using Azure AI Document Intelligence
- AI-based expense category suggestion using Azure OpenAI
- Confidence score generation for every suggestion
- Rule-based fallback categorisation during LLM outages
- Claimant ability to accept or override suggestions
- Logging categorisation events to Application Insights
- Feature flag support using Azure App Configuration

## Affected Containers / Services

- GreenChit Web App
- Claims API Service
- Azure OpenAI Service
- Azure AI Document Intelligence
- Azure App Configuration
- Application Insights

---

# 3. Contract

## Inputs

### Endpoint

```http
POST /claims/{claimId}/receipts/categorise
```

### Request Body

- Receipt image file (jpeg or png)
- Maximum size: 10 MB
- Claim ID path parameter

### Example Request

```http
POST /claims/12345/receipts/categorise
Content-Type: multipart/form-data
```

---

## Outputs

### Success Response — 200 OK

```json
{
  "category": "Meals",
  "confidence": 0.84,
  "source": "llm",
  "needs_review": false
}
```

---

## Response Fields

| Field | Type | Description |
|---|---|---|
| category | enum | Meals, Travel, Lodging, Office Supplies, Other |
| confidence | float | Confidence score between 0.0 and 1.0 |
| source | string | "llm" or "rule-based" |
| needs_review | boolean | True if confidence < 0.6 |

---

## Errors

| HTTP Code | Reason |
|---|---|
| 400 | Invalid file type or missing receipt |
| 401 | Unauthorized request |
| 413 | Uploaded file exceeds 10 MB |
| 502 | OCR or Azure OpenAI unavailable |
| 503 | Categoriser feature disabled by feature flag |

### Example Error Response

```json
{
  "error": "Receipt image exceeds maximum allowed size of 10 MB"
}
```

---

## Side Effects

The system emits an Application Insights custom event:

```text
categoriser.suggested
```

### Logged Fields

| Field | Description |
|---|---|
| claimId | Claim identifier |
| suggestedCategory | AI suggested category |
| finalCategory | User selected category |
| confidence | Returned confidence score |
| source | llm or rule-based |
| timestamp | Suggestion time |

---

## Privacy Rules

- No full receipt image stored in logs
- No customer names logged
- No credit card numbers logged
- No personally identifiable information leaves the BISTEC Azure tenant

---

# 4. Acceptance Criteria

## AC-01 Happy Path — Clear Meal Receipt

### Given

A restaurant receipt totaling LKR 2,400

### When

The claimant uploads the receipt

### Then

The API returns:

```json
{
  "category": "Meals",
  "confidence": 0.7,
  "source": "llm"
}
```

And an Application Insights event is emitted within 5 seconds.

---

## AC-02 Ambiguous Receipt

### Given

A receipt containing both food and stationery items

### When

Processed by the categoriser

### Then

The response includes:

- confidence score
- needs_review field set according to threshold

---

## AC-03 LLM Failure Fallback

### Given

Azure OpenAI returns HTTP 503

### When

A receipt is uploaded

### Then

The system falls back to rule-based categorisation

And the response contains:

```json
{
  "source": "rule-based"
}
```

---

## AC-04 OCR Failure

### Given

An unreadable or blurry receipt image

### When

OCR extraction fails

### Then

The response category is:

```json
{
  "category": "Other"
}
```

And the user receives a clear error message.

---

## AC-05 Oversized Payload

### Given

A receipt image larger than 10 MB

### When

Uploaded

### Then

The API returns:

```http
413 Payload Too Large
```

---

## AC-06 PII Boundary

### Given

A receipt containing customer name and masked card number

### When

Categorisation occurs

### Then

No PII appears in Application Insights logs.

---

# 5. Examples

## Example 1 — Happy Path

### Input

Restaurant receipt image

### Output

```json
{
  "category": "Meals",
  "confidence": 0.91,
  "source": "llm",
  "needs_review": false
}
```

---

## Example 2 — Ambiguous Receipt

### Input

Receipt containing sandwiches and printer paper

### Output

```json
{
  "category": "Other",
  "confidence": 0.54,
  "source": "llm",
  "needs_review": true
}
```

---

## Example 3 — OCR Failure

### Input

Blurry low-resolution receipt image

### Output

```json
{
  "category": "Other",
  "confidence": 0.10,
  "source": "rule-based",
  "needs_review": true
}
```

---

# 6. Out of Scope

The following features are explicitly excluded from v1:

- Multi-receipt batch categorisation
- Automatic claim approval
- Automatic submission without claimant confirmation
- Training or fine-tuning custom AI models
- Support for PDF receipt uploads
- Multi-language receipt categorisation
- Finance policy validation
- Fraud detection
- Receipt duplicate detection

---

# 7. Open Questions

- Should confidence threshold remain fixed at 0.6 or become configurable?
- Should user overrides be used for future active-learning improvements?
- Should categorisation results be cached for duplicate receipts?
- Should PDF receipts be supported in a future release?
- What retention period should apply to categorisation logs?
- Should the categoriser support Sinhala and Tamil receipts in future versions?