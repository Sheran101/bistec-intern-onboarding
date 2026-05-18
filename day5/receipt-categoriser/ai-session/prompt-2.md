Update the implementation to handle Azure OpenAI 503 failure.

Expected behaviour:
- Return 200 OK.
- Use source: "rule-based".
- Confidence must be <= 0.5.
- Category must still be one of the allowed categories.