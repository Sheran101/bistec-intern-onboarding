The AI added fallback logic for LLM failure.

It matched the spec mostly, but initially returned 502 instead of 200 for LLM 503.

Fix:
I changed the fallback behaviour to return 200 with source "rule-based" and confidence <= 0.5.