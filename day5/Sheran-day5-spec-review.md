# Receipt Categoriser — Spec Review

## Setup

- Reviewer pair: Sheran Ranjula
- Spec version reviewed: `a1c9f42`

---

# Results Summary

| Metric | Target | Achieved |
|--------|--------|----------|
| Total smells identified | 5+ | 6 |
| Acceptance criteria pushed back on | 1+ | 2 |
| Reviewer disagreements that produced a real change | 1+ | 1 |

---

# Common Feedback Summary

## Strengths

- Clear API endpoint structure and request flow
- Acceptance criteria included measurable confidence thresholds
- Good separation between happy paths and error handling
- Privacy and PII handling requirements were clearly documented
- Fallback behaviour for Azure OpenAI outages was properly defined

---

## Risks

- Some requirements were vague and difficult to test directly
- Certain sections assumed infrastructure decisions too early
- A few acceptance criteria referenced implementation details instead of observable behaviour
- Some user-facing messages were not specific enough for testing
- Confidence threshold logic appeared in multiple sections and could become inconsistent later

---

# Smell Review Table

| # | Section | Smell Type | Quote | Suggested Rewrite |
|---|---|---|---|---|
| 1 | Contract | embedded solution | "Responses must be cached in Redis for 10 minutes." | "Categoriser responses may be cached if performance testing shows repeated receipt uploads create unnecessary processing overhead." |
| 2 | Acceptance Criteria | vague | "The system should return results quickly." | "The categoriser response must be returned within 4 seconds p95 under normal operating conditions." |
| 3 | Errors | hidden assumption | "OCR failure should return an error popup." | "OCR failure should return a user-visible error message through the client application." |
| 4 | Scope | vague | "Support multiple receipt formats." | "Support JPEG and PNG receipt images up to 10 MB." |
| 5 | Side Effects | embedded solution | "Store all logs in Cosmos DB." | "Store categorisation audit logs in the organisation-approved logging platform." |
| 6 | Acceptance Criteria | implementation-bound | "The backend calls OCRService.parseReceipt()." | "The uploaded receipt text is successfully extracted and categorised." |

---

# Concrete Rewrites

## Rewrite 1

### Before

```txt
The system should process receipts quickly.
```

### Smell Type

Vague requirement

### After

```txt
The categoriser endpoint must return responses within 4 seconds p95.
```

---

## Rewrite 2

### Before

```txt
Use Redis cache to improve categorisation performance.
```

### Smell Type

Embedded solution

### After

```txt
Caching may be introduced if performance testing identifies repeated receipt uploads causing latency issues.
```

---

## Rewrite 3

### Before

```txt
OCR failures should display an error popup.
```

### Smell Type

Hidden assumption

### After

```txt
OCR failures should present a clear user-visible error message through the client application.
```

---

# Reviewer Disagreement

One reviewer suggested removing the `needs_review` field from the backend API response and calculating it only in the frontend UI.

After discussion, the decision was made to keep the `needs_review` field in the backend response because:

- The confidence threshold is part of backend business rules
- Multiple client applications may use the API in the future
- Returning the field directly ensures consistent behaviour across all clients
- It avoids duplicating logic in multiple frontend applications

---

# Accepted Improvements

## Improvement 1

### Before

```txt
The system should display a clear error message.
```

### After

```txt
The system should display the message:
"Receipt could not be processed. Please review manually."
```

### Reason

The updated version is more specific, measurable, and easier to test.

---

## Improvement 2

### Before

```txt
Support multiple receipt formats.
```

### After

```txt
Support JPEG and PNG receipt images up to 10 MB.
```

### Reason

The rewritten version removes ambiguity and clearly defines supported formats and size limits.

---

# Reflection

The most common issue found during the review process was vagueness in requirements and user-facing behaviour. Several statements described expected outcomes without defining measurable outputs or exact observable behaviour.

The easiest smell type to identify was embedded solutions because some requirements forced specific technologies such as Redis or Cosmos DB instead of describing the actual business need.

This review process highlighted the importance of writing specifications that focus on measurable behaviour, business outcomes, and externally observable results rather than implementation details. It also demonstrated how clear acceptance criteria make testing and AI-assisted implementation significantly easier.