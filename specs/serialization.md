# Serialization

Safe serialization provides bounded, non-throwing representations for complex
values, including Errors, functions, symbols, BigInts, buffers, cycles, and
unserializable properties. Serialization limits are separate from secrecy
rules. Unsupported non-plain objects intentionally reduce to safely readable
enumerable own properties; inherited, non-enumerable, accessor-backed, or
hostile state may be omitted. Accessor-backed properties are intentionally not
invoked, even when their descriptors are enumerable; getters are outside the
safe serializer's supported execution boundary.

`maxKeys` limits retained source data properties. An over-limit object may
therefore contain one additional collision-safe `[TRUNCATED]` metadata property;
that metadata slot is intentional and is not counted as source data.
Cycle detection is path-local: repeated non-cyclic references are serialized
independently, while references encountered on the active recursion path emit
the circular marker.
The serializer is deliberately non-throwing at its public boundary; unexpected
errors during hostile-value inspection are reduced to `[UNSERIALIZABLE]` so a
logging path cannot fail because of diagnostic serialization.
Depth truncation replaces an object once its depth exceeds `maxDepth`; keys
of an object still being represented are redacted before child traversal is
truncated. Thus sensitive fields at the represented boundary remain markers,
while deeper object shape is intentionally omitted.
