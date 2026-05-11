# BookSwap — Storage and Cache Decisions

## 1. Data Inventory

| Data Type | Example Record | Volume Estimate (1 Year) | Read/Write Ratio |
|---|---|---|---|
| Book listings | One row per listed book | ~50,000 books | Read-heavy |
| Borrow requests | Request to borrow a book | ~120,000 requests | Balanced |
| Loans | Loan tracking records | ~100,000 loans | Read-heavy |
| Member profiles | Name and member ID | ~10,000 members | Read-heavy |
| Book photos | JPEG/PNG image files | ~250 GB | Write-light |
| Notifications | In-app notifications | ~500,000 notifications | Write-heavy |
| Weekly digest jobs | Email digest queue messages | ~500,000 messages | Write-heavy |
| Search results | Frequently searched books | Temporary cache only | Read-heavy |

---

# 2. Storage Selection

| Data Type | Chosen Store | Why This Store | Why Not the Alternatives |
|---|---|---|---|
| Book listings | Azure SQL | Relational structure fits books, owners, and loans with joins and foreign keys | Cosmos DB is unnecessary because relationships are important and data structure is predictable |
| Borrow requests | Azure SQL | Transaction consistency is important when accepting or declining requests | Redis is not durable enough for business records |
| Loans | Azure SQL | Loans require reliable tracking and overdue calculations | Blob Storage cannot efficiently query relational records |
| Member profiles | Azure SQL | Strong consistency and structured member data | Cosmos DB would increase complexity without clear benefit |
| Book photos | Azure Blob Storage | Optimized for large binary files and low-cost storage | Storing images inside SQL would increase database size and backup costs |
| Search cache | Azure Cache for Redis | Very fast reads improve search response time under 300 ms | SQL queries alone may become slower during peak usage |
| Notification jobs | Azure Service Bus | Reliable asynchronous message processing with retries and dead-letter queues | Direct synchronous processing could fail if email service becomes unavailable |
| Weekly digest jobs | Azure Service Bus | Allows scheduled background processing without blocking users | Cron-only processing without queue durability risks message loss |
| Weekly digest emails | Azure Communication Services Email | Managed Azure email delivery service | Building a custom SMTP service would increase operational complexity |

---

# 3. Cache Plan

## What Should Be Cached

| Cached Data | Why Cache It | TTL |
|---|---|---|
| Book details | Frequently viewed and changes rarely | 60 seconds |
| Search results | High read frequency during browsing | 30 seconds |
| Recently added books | Used for weekly digest and homepage | 60 seconds |

## What Should NOT Be Cached

| Data | Why Not Cache |
|---|---|
| Borrow request status | Users need real-time updates |
| Loan return updates | Incorrect stale data may confuse members |
| Authentication tokens | Authentication handled externally by Microsoft Entra |

---

## Cache-Aside Pattern

```javascript
async function getBook(bookId) {

  const cacheKey = `book:${bookId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const row = await sql.query(
    "SELECT * FROM books WHERE id = ?",
    [bookId]
  );

  if (!row) {
    return null;
  }

  // Cache for 60 seconds because book metadata changes rarely
  await redis.set(
    cacheKey,
    JSON.stringify(row),
    "EX",
    60
  );

  return row;
}

async function updateBook(bookId, patch) {

  const updated = await sql.update(
    "books",
    bookId,
    patch
  );

  // Remove stale cache entry
  await redis.del(`book:${bookId}`);

  return updated;
}
```

---

## Cache Invalidation Strategy

| Event | Action |
|---|---|
| Book updated | Delete Redis cache entry |
| Book becomes unavailable | Invalidate related search cache |
| Loan returned | Refresh availability cache |
| New book added | Clear recent-books cache |

The API service is responsible for invalidating cache entries immediately after database updates.

---

# 4. Queue Plan

## Which Work Goes on a Queue

| Queue Task | Why Queue It |
|---|---|
| Weekly digest emails | Email sending should not block API requests |
| In-app notifications | Improves responsiveness and reliability |
| Loan accepted notifications | Async delivery improves user experience |
| Failed email retries | Retry safely without affecting users |

---

## What Happens if Consumer is Down for 30 Minutes

Messages remain safely stored inside Azure Service Bus until the consumer becomes available again.

The API continues accepting requests because queue publishing is lightweight and independent from notification processing.

When the consumer recovers:

- queued messages are processed in order
- retries continue automatically
- failed messages move to the Dead Letter Queue (DLQ)

---
