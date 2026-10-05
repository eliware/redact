# Release Notes

## 11.0.0 — 2026-10-04

### Added

- Policy creation with configurable sensitive keys and redaction markers.
- Non-mutating structured value redaction and HTTP header redaction.
- Best-effort text redaction and literal-secret replacement.
- Bounded safe serialization for logging and diagnostic output.
- Native ESM public exports with TypeScript declarations, documentation, and runnable examples.

### Security

Redaction is best-effort and does not guarantee detection of unknown secrets.

- Text redaction now caps output at 10,000 characters by default, configurable with `maxOutputLength`.
- Policy key views no longer expose runtime Set mutation methods that could disable default redaction.
- Safe serialization and structured redaction preserve enumerable own `__proto__` keys as data.
- Malformed header entry arrays now fail closed with an empty entry array.
- Structured redaction now bounds depth, object keys, and array items, with configurable limits and truncation markers.
