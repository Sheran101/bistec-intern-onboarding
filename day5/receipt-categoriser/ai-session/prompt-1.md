Implement the Receipt Categoriser based only on the spec and acceptance criteria.

Rules:
- Do not invent extra fields.
- Output category must be one of Meals, Travel, Lodging, Office Supplies, Other.
- Confidence must be 0.0 to 1.0.
- Use LLM path first.
- Add rule-based fallback when LLM is unavailable.