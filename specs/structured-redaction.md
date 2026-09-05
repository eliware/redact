# Structured Redaction

Structured redaction recursively copies values and replaces sensitive fields
with a stable marker. It must handle nested objects, arrays, Errors,
null-prototype objects, cycles, throwing accessors, and hostile objects safely.
It detects cycles but does not preserve non-cyclic shared-reference identity;
repeated references are copied. It is intentionally unbounded by object-key
count; callers requiring bounded work should use `safeSerialize`.
