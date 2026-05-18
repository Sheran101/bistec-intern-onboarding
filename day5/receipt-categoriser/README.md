# Receipt Categoriser

## Run tests
1. Open terminal in this folder.
2. Run `npm install`.
3. Run `npm test`.
4. All acceptance tests should pass.

| # | What you asked the AI | What it produced | Did it match the spec? | Your fix / follow-up |
|---|---|---|---|---|
| 1 | First implementation pass | Basic categoriser with extra `tags` field | Partial — invented field not in spec | Removed `tags`, added test |
| 2 | Add fallback when LLM 503 | Returned error response first | Partial — spec needs fallback 200 OK | Changed to rule-based fallback |
| 3 | Add acceptance tests | Added happy path only | Partial — needed 3+ criteria | Added fallback, OCR failure, oversized tests |