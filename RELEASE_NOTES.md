# Release Notes

## 12.0.0 — 2026-10-12

### Added

- Create policies with custom sensitive keys and redaction markers.
- Redact structured values without changing input data.
- Redact sensitive HTTP header values.
- Redact common secret patterns and configured secrets in text.
- Replace literal secrets in text.
- Serialize values with limits for depth, keys, arrays, and strings.
- Handle errors, buffers, cycles, and unsupported values.
- Export native ESM functions with TypeScript declarations.
- Include API documentation, specifications, and runnable examples.
- Redaction does not detect every secret.

### Changed

- Align package metadata, documentation, and specifications with Convention v12.
- Include repository specifications in the published package.
