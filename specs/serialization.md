# Serialization

Safe serialization provides bounded, non-throwing representations for complex
values, including Errors, functions, symbols, BigInts, buffers, cycles, and
unserializable properties. Serialization limits are separate from secrecy
rules. Unsupported non-plain objects intentionally reduce to safely readable
enumerable own properties; inherited, non-enumerable, accessor-backed, or
hostile state may be omitted. Accessor-backed properties are intentionally not
invoked, even when their descriptors are enumerable; getters are outside the
safe serializer's supported execution boundary.
