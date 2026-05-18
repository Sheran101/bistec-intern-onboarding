const { categorise } = require("../src/categoriser");

test("AC-01 happy path: clear meal receipt", async () => {
  const result = await categorise("Restaurant bill food total LKR 2400");

  expect(result.status).toBe(200);
  expect(result.category).toBe("Meals");
  expect(result.confidence).toBeGreaterThanOrEqual(0.7);
  expect(result.source).toBe("llm");
});

test("AC-02 LLM unavailable falls back to rule-based", async () => {
  const result = await categorise("Restaurant food receipt", { llmStatus: 503 });

  expect(result.status).toBe(200);
  expect(result.source).toBe("rule-based");
  expect(result.confidence).toBeLessThanOrEqual(0.5);
});

test("AC-03 OCR failure returns Other", async () => {
  const result = await categorise("");

  expect(result.status).toBe(200);
  expect(result.category).toBe("Other");
  expect(result.source).toBe("rule-based");
  expect(result.needs_review).toBe(true);
});

test("AC-04 oversized payload returns 413", async () => {
  const result = await categorise("receipt text", { fileSizeMB: 12 });

  expect(result.status).toBe(413);
});