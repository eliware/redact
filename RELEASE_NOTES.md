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
