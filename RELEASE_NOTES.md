# Release Notes

## 14.0.0 — 2026-10-21

### Changed

- Align package metadata and the repository specification with Convention v14.
- Update `@eliware/test` to version 14 and refresh compatible development dependencies.
- Clarify installation, package guidance, API limits, and literal-secret matching.
- Separate literal-secret matching from replacement and organize array traversal modules.

### Fixed

- Add redaction markers for sensitive array properties without reading their values when `maxKeys` is exhausted.
- Do not read more non-sensitive array values than `maxKeys` allows.
- Preserve retained array items when extra-property inspection fails and mark the array as truncated.
- Mark omitted enumerable Error fields as truncated without reading their values.
- Use inspected data values for array properties to prevent repeated proxy access.
