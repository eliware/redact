# Headers

Header redaction replaces sensitive HTTP header values while preserving safe
header names and values. Matching is case-insensitive and supports the header
representations selected by the public API.

The supported inputs are plain objects, `Headers`-style objects exposing
`entries()`, and arrays of `[name, value]` entries. Object and `Headers` inputs
normalize to a null-prototype object; entry-array inputs retain array shape.
Arbitrary iterable objects without an `entries()` method are not part of the
public input contract.
