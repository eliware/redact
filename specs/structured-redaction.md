# Structured Redaction

Structured redaction recursively copies values and replaces sensitive fields
with a stable marker. It must handle nested objects, arrays, Errors,
null-prototype objects, cycles, throwing accessors, and hostile objects safely.
