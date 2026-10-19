# Release Notes

## 13.0.0 — 2026-10-19

### Added

- `redactText` redacts JWT-like values with an empty signature segment.

### Changed

- The package version and specifications follow Convention v13.
- The project uses `@eliware/test` 13 and updated dependency versions.
- Internal redaction and serialization modules have focused responsibilities.
- The documentation explains API behavior, limits, safe use, setup, and package contents.
- The README and repository guidance remove redundant details.
- Literal secret matching handles large secret lists with less repeated work.
- CI checks use full Git history and current checkout action versions.
- The npm workflow uses the canonical file and checks release tags against package versions.
- The Knit workflow deploys from `/eliware/redact`, uses a five-minute timeout, and runs `git pull`.
- The public exports remain unchanged after the internal refactor.

### Fixed

- Array redaction applies one `maxKeys` limit to index values and named properties.
- Array redaction omits non-sensitive function properties and getters that return functions.
- Array redaction keeps later values when it omits a getter that returns a function.
- Safe serialization limits strings and labels to the `maxString` value.
- The published directives remove duplicated wording and state the header prohibition clearly.
