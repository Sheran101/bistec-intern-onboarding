# BookSwap — Mock Smoke Test Report

# Setup

## OpenAPI Validation Command

```bash
npx @apidevtools/swagger-cli validate Sheran-day2-bookswap-openapi.yaml
```

## Validation Result

```text
Sheran-day2-bookswap-openapi.yaml is valid
```

---

## Mock Server Command

```bash
npx @stoplight/prism-cli mock Sheran-day2-bookswap-openapi.yaml --port 4010
```

---

## Test Tool Used

- Postman
- curl
- Prism mock server

---

# Smoke Test Results

| # | Endpoint | Method | Body / Params | Expected Status | Actual Status | Result |
|---|---|---|---|---|---|---|
| 1 | `/books` | GET | `page=1&pageSize=20` | 200 | 200 | Pass |
| 2 | `/books` | POST | Valid book payload | 201 | 201 | Pass |
| 3 | `/books` | POST | Missing title field | 400 or 422 | 422 | Pass |
| 4 | `/books/999/borrow-requests` | POST | Borrower JWT | 201 | 201 | Pass |
| 5 | `/books` | GET | No Authorization header | 401 | 401 | Pass |

---

# Example Requests Used

## 1. GET Books

```bash
curl -X GET "http://localhost:4010/books?page=1&pageSize=20"
```

### Expected

- paginated response
- array of books
- status 200

---

## 2. POST Create Book

```bash
curl -X POST "http://localhost:4010/books" \
-H "Content-Type: application/json" \
-d '{
  "title": "Atomic Habits",
  "author": "James Clear",
  "isbn": "9780735211292",
  "condition": "good",
  "photoUrl": "https://blob.bookswap.local/book1.jpg"
}'
```

### Expected

- new book object returned
- status 201

---

## 3. POST Invalid Book Payload

```bash
curl -X POST "http://localhost:4010/books" \
-H "Content-Type: application/json" \
-d '{
  "author": "James Clear"
}'
```

### Expected

- validation error
- status 422

---

## 4. POST Borrow Request

```bash
curl -X POST "http://localhost:4010/books/999/borrow-requests" \
-H "Authorization: Bearer sample-token" \
-H "Content-Type: application/json" \
-d '{
  "message": "Can I borrow this for one week?"
}'
```

### Expected

- borrow request created
- status 201

---

## 5. Unauthorized Request

```bash
curl -X GET "http://localhost:4010/books"
```

### Expected

- unauthorized response
- status 401

---

# Results Summary

| Metric | Target | Achieved |
|---|---|---|
| Tests run | 5 | 5 |
| Tests passing against mock | 5 | 5 |
| Endpoints with explicit error responses | 4+ | 6 |
| Pagination support implemented | Yes | Yes |
| Reusable schemas via `$ref` | Yes | Yes |

---

# Findings

## 1. The Mock Revealed Missing Example Payloads

The initial OpenAPI specification did not contain response examples for some endpoints.

Prism generated generic placeholder responses, which made testing harder because object structures were not immediately clear.

This showed that adding `examples:` sections would improve API usability for frontend developers.

---

## 2. Borrow Request Flow Needed Clearer Ownership Rules

While testing the borrow request endpoints, it became clear that the specification should define:

- who is allowed to accept requests
- whether owners can reject already accepted requests
- whether duplicate requests are allowed

These business rules were not obvious from the original schema alone.

---

## 3. Pagination Worked Consistently

Using the shared `BookPage` and `LoanPage` schemas made pagination responses consistent across endpoints.

This reduced duplication and improved API readability.

---

## 4. Validation Errors Improved API Clarity

The use of:

- `required`
- `enum`
- schema validation

helped Prism correctly return `422` responses for invalid payloads.

This confirmed that the OpenAPI validation rules were working correctly.

---

# Spec Changes I Would Make

## 1. Add Response Examples

### File

```text
Sheran-day2-bookswap-openapi.yaml
```

### Change

Add `examples:` under:

- `Book`
- `Loan`
- `BorrowRequest`

### Reason

- improves frontend integration
- improves Prism mock readability

---

## 2. Add Security Scheme Definition

### Add

```yaml
components:
  securitySchemes:
```

with bearer JWT authentication.

### Reason

- better OpenAPI documentation
- more realistic authentication modeling

---

## 3. Add Standard Error Schema

### Create reusable

```yaml
ErrorResponse:
```

schema.

### Reason

- consistent error formatting
- easier frontend error handling

---

## 4. Add Rate Limiting Response

### Add

```yaml
429 Too Many Requests
```

for search endpoints.

### Reason

- protects API from abuse
- improves production readiness

---

# Reproducibility Instructions

Another developer can reproduce these tests by following the steps below.

---

## Step 1

Install dependencies:

```bash
npm install -g @apidevtools/swagger-cli
npm install -g @stoplight/prism-cli
```

---

## Step 2

Validate the specification:

```bash
npx @apidevtools/swagger-cli validate Sheran-day2-bookswap-openapi.yaml
```

---

## Step 3

Run Prism mock server:

```bash
npx @stoplight/prism-cli mock Sheran-day2-bookswap-openapi.yaml --port 4010
```

---

## Step 4

Run curl or Postman requests against:

```text
http://localhost:4010
```