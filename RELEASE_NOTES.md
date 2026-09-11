# Release Notes

## 8.0.0

- Breaking generic redaction contract for shared Eliware consumers.
- Provides fixed `[REDACTED]` sensitive-value replacements and fixed structural
  markers for truncation, circular values, and unserializable values.
- Adds generic coverage for environment assignments, provider credentials,
  public keys, opaque secrets, structured values, headers, text, and errors.
- Supports bounded output with a default `maxString` limit of 10,000 and an
  explicit generic `maxString` option.
