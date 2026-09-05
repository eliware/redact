# Structured Redaction

Structured redaction recursively copies values and replaces sensitive fields
with a stable marker. It must handle nested objects, arrays, Errors,
null-prototype objects, cycles, throwing accessors, and hostile objects safely.
It detects cycles but does not preserve non-cyclic shared-reference identity;
repeated references are copied. Traversal is bounded by the policy's
`maxDepth`, `maxKeys`, and `maxArray` limits, and emits `[TRUNCATED]` when a
limit is reached.
Hostile array operations that do not produce an array are reduced to an empty
safe result; individual child failures are represented as `[UNSERIALIZABLE]`
without discarding other safe items.
Non-plain built-ins such as `Date`, `Map`, and `Set` are outside the structured
redactor's preservation contract; callers requiring safe representation of
those values should use `safeSerialize`. Their enumerable own properties may
be copied, but internal built-in state is intentionally not reconstructed.
