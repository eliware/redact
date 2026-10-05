# API Guide

`@eliware/redact` exposes a small native ESM API for redaction and safe serialization. Import public functions from the package name; internal source modules are not part of the public contract.

## Policy

`createPolicy(options)` creates a normalized redaction policy. `defaultPolicy` is the package default. Policy options can supply sensitive `keys`, `redactKeys`, a `marker`, and a `circularMarker`.

## Redaction

- `redactValue(value, options)` returns a redacted copy of structured data.
- `redactHeaders(headers, options)` redacts sensitive header values.
- `redactText(value, options)` applies best-effort text rules and can receive configured literal `secrets`.
- `replaceLiteralSecret(value, secret, marker)` replaces literal occurrences in text.

## Safe serialization

`safeSerialize(value, options)` returns a bounded, safe representation for logging and diagnostic use. Serialization options extend policy options with `maxDepth`, `maxKeys`, `maxArray`, and `maxString` limits.

The declarations in `src/index.d.ts` describe the public TypeScript surface. Detailed behavior and compatibility boundaries are recorded in [specifications](../specs/README.md).
