# Release Notes

## 15.0.0 — 2026-10-21

### Changed

- Update package metadata and repository rules for Eliware Test v15.
- Limit text input before redaction and keep a bounded lookahead for configured secrets.
- Stop array index checks after `maxKeys` while preserving sensitive index markers.
- Document truncation markers, `maxKeys`, and text output limits.
- Link the documentation index from the root README and document the updated limits.

### Fixed

- Redact configured secrets that cross the input truncation boundary.
- Redact incomplete key material blocks when bounded input ends before the closing delimiter.
- Continue redaction when a configured key cannot convert safely to text.
- Preserve array property behavior while inspecting own keys without reading omitted values.

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
