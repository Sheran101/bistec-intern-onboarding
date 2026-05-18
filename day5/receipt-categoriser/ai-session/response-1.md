The AI produced an initial categoriser with category, confidence, source, and an extra tags field.

Issue:
The tags field was not in the spec.

Fix:
I removed the tags field and added tests to ensure only required behaviour is checked.