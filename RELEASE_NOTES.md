# Release Notes

## 13.0.0 — 2026-10-17

### Changed

- Align package metadata and release workflows with Convention v13.
- Use the canonical npm publication workflow.

## 12.0.0 — 2026-10-12

### Added

- Create policies with custom sensitive keys and redaction markers.
- Redact structured values without changing input data.
- Redact sensitive HTTP header values.
- Redact known secret patterns and configured secrets in text.
- Replace literal secrets in text.
- Serialize values with limits for depth, keys, arrays, and strings.
- Support errors, buffers, cycles, and unsupported values.
- Export native ESM functions with TypeScript declarations.
- Include API documentation, specifications, and runnable examples.
- Redaction does not find every secret.

### Changed

- Align package metadata, documentation, and specifications with Convention v12.
- Include repository specifications in the published package.
