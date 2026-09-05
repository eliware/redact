# Structured Redaction

Structured redaction recursively copies values and replaces sensitive fields
with a stable marker. It must handle nested objects, arrays, Errors,
null-prototype objects, cycles, throwing accessors, and hostile objects safely.
It detects cycles but does not preserve non-cyclic shared-reference identity;
repeated references are copied. Traversal is bounded by the policy's
`maxDepth`, `maxKeys`, and `maxArray` limits, and emits `[TRUNCATED]` when a
limit is reached.
