# API Guide

`@eliware/redact` exposes a small native ESM API for redaction and safe serialization. Import public functions from the package name; internal source modules are not part of the public contract.

## Policy

`createPolicy(options)` creates a normalized redaction policy. `defaultPolicy` is the package default. Policy options can supply sensitive `keys`, `redactKeys`, a `marker`, and a `circularMarker`.

Policy `keys` are exposed as frozen, read-only Set views. They support the `ReadonlySet` interface but have no `add`, `delete`, or `clear` methods.

## Redaction

- `redactValue(value, options)` returns a redacted copy of structured data. `maxDepth`, `maxKeys`, and `maxArray` default to 20, 1,000, and 1,000. Reaching the depth limit returns `[TRUNCATED]`; omitted array items add a `[TRUNCATED]` array item, and omitted object keys add a `__truncated` property. Key limits bound retained property reads; JavaScript still enumerates all own keys to produce the key list.
- `redactHeaders(headers, options)` redacts sensitive header values. Valid entry-array inputs preserve duplicate names; Headers-like iterable inputs return a record where duplicate names collapse to the last redacted value. Malformed entry-array inputs and failures reading or iterating a Headers-like input return an empty entry array.
- `redactText(value, options)` applies best-effort text rules and can receive configured literal `secrets`.
- `replaceLiteralSecret(value, secret, marker)` replaces literal occurrences in text.

## Safe serialization

`safeSerialize(value, options)` returns a bounded, safe representation for logging and diagnostic use. Serialization options extend policy options with `maxDepth`, `maxKeys`, `maxArray`, and `maxString` limits. Object serialization and structured redaction operate on enumerable string-keyed properties; enumerable symbol-keyed properties are omitted. An enumerable own `__proto__` key is preserved as data and does not change the result prototype. `safeSerialize` reads at most `maxKeys` property values and performs a key-only lookahead to mark truncation. JavaScript's own-key enumeration supplies a complete list before this value-read bound can be applied. If reading a retained enumerable property fails, serialization returns an empty object instead of a partial result. Structured redaction reads at most the configured retained values and items; if reading a retained enumerable own property fails, it returns an empty object. Configured sensitive keys apply to Error `name`, `message`, and `stack` fields as well as custom properties. The public module exports exactly the declarations listed in `src/index.d.ts`.

The declarations in `src/index.d.ts` describe the public TypeScript surface. Detailed behavior and compatibility boundaries are recorded in [specifications](../specs/README.md).
