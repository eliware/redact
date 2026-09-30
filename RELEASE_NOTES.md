# Release Notes

## 9.0.0 — 2026-09-30

### Changed

- Align package and specification versions with the v9 convention baseline.
- Assign Redact's repository directive ID `E-101`.
- No user-facing library API or runtime behavior changed.

## 8.0.0 — 2026-09-11

### Changed

- Breaking generic redaction contract for shared Eliware consumers.
- Provides fixed `[REDACTED]` sensitive-value replacements and fixed structural
  markers for truncation, circular values, and unserializable values.
- Adds generic coverage for environment assignments, provider credentials,
  public keys, opaque secrets, structured values, headers, text, and errors.
- Supports bounded output with a default `maxString` limit of 10,000 and an
  explicit generic `maxString` option.
