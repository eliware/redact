# Structured Redaction

Structured redaction recursively copies values and replaces sensitive fields
with the fixed `[REDACTED]` marker. It must handle nested objects, arrays, Errors,
null-prototype objects, cycles, throwing accessors, and hostile objects safely.
Standard Error fields such as `name`, `message`, and `stack` are checked against
the configured sensitive-key policy before their values are copied.
It detects cycles but does not preserve non-cyclic shared-reference identity;
repeated references are copied. Traversal is bounded by the policy's
`maxDepth`, `maxKeys`, and `maxArray` limits, and emits `[TRUNCATED]` when a
limit is reached.
Accessor-backed object properties are omitted without invoking their getters.
`maxKeys` limits copied output properties; object-key enumeration first
materializes the object's own-key list, so this option does not bound that
enumeration's temporary memory use.
Hostile array operations that do not produce an array are reduced to an empty
safe result; individual child failures are represented as `[UNSERIALIZABLE]`
without discarding other safe items.
Non-plain built-ins such as `Date`, `Map`, and `Set` are outside the structured
redactor's preservation contract; callers requiring safe representation of
those values should use `safeSerialize`. Their enumerable own properties may
be copied, but internal built-in state is intentionally not reconstructed.
