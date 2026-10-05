# Release Notes

## 11.0.0 — 2026-10-04

### Added

- Established the v11 public package contract with native ESM exports, TypeScript declarations, documentation, examples, and an explicit package allowlist.
- Added policy creation, structured and header redaction, best-effort text redaction, literal-secret replacement, and bounded safe serialization.
- Added focused mirrored tests and shared repository validation.

### Security

- Documented that redaction is best-effort and does not guarantee detection of unknown secrets.
