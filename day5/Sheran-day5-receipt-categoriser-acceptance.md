# Receipt Categoriser — Acceptance Criteria

## AC-01 happy path: clear meal receipt

**Given** a receipt image of a restaurant bill totalling LKR 2,400  
**When** the claimant uploads it via `POST /claims/{id}/receipts/categorise`  
**Then** the response is `200 OK` with:

```json
{
  "category": "Meals",
  "confidence": 0.7,
  "source": "llm",
  "needs_review": false
}
```

And the confidence must be greater than or equal to 0.7  
And an Application Insights customEvent `categoriser.suggested` is emitted within 5 seconds.

---

## AC-02 ambiguous receipt: mixed food and stationery

**Given** a receipt image containing mixed items such as sandwiches, coffee, pens, and notebooks  
**When** the claimant uploads it via `POST /claims/{id}/receipts/categorise`  
**Then** the response is `200 OK` with a valid category from:

- Meals
- Travel
- Lodging
- Office Supplies
- Other

And the response includes a confidence score between `0.0` and `1.0`  
And if the confidence is below `0.6`, `needs_review` is set to `true`.

---

## AC-03 LLM unavailable — rule-based fallback

**Given** Azure OpenAI is returning `503 Service Unavailable`  
**When** the claimant uploads a valid receipt image  
**Then** the response is `200 OK` with:

```json
{
  "source": "rule-based"
}
```

And the confidence is less than or equal to `0.5`  
And the claimant still receives a category suggestion instead of a failed request.

---

## AC-04 OCR failure

**Given** a blurry or unreadable receipt image that Azure AI Document Intelligence cannot parse  
**When** the claimant uploads it via `POST /claims/{id}/receipts/categorise`  
**Then** the response is `200 OK` with:

```json
{
  "category": "Other",
  "source": "rule-based",
  "needs_review": true
}
```

And the confidence is below `0.6`  
And the claimant sees a clear message such as:

```text
Receipt could not be read clearly. Please review the suggested category.
```

---

## AC-05 oversized payload

**Given** a receipt image larger than `10 MB`  
**When** the claimant uploads it via `POST /claims/{id}/receipts/categorise`  
**Then** the response is:

```http
413 Payload Too Large
```

And the response message explains that the maximum allowed receipt size is `10 MB`  
And no categorisation suggestion is created.

---

## AC-06 invalid file type

**Given** a claimant uploads a file that is not JPEG or PNG, such as a PDF or DOCX file  
**When** the request is sent to `POST /claims/{id}/receipts/categorise`  
**Then** the response is:

```http
400 Bad Request
```

And the response message explains that only JPEG and PNG receipt images are supported  
And no Application Insights `categoriser.suggested` event is emitted.

---

## AC-07 PII boundary

**Given** a receipt image contains a customer name and credit card last four digits  
**When** the receipt is processed by the categoriser  
**Then** the Application Insights customEvent `categoriser.suggested` contains no personally identifiable information  
And the customEvent does not contain customer names  
And the customEvent does not contain a full credit card number  
And no receipt image content is stored in the customEvent payload.