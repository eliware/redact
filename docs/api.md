# API Guide

`@eliware/redact` exposes a small native ESM API for redaction and safe serialization. Import public functions from the package name; internal source modules are not part of the public contract.

## Policy

`createPolicy(options)` creates a normalized redaction policy. `defaultPolicy` is the package default. Policy options can supply sensitive `keys`, `redactKeys`, a `marker`, and a `circularMarker`.

Policy `keys` are exposed as frozen, read-only Set views. They support the `ReadonlySet` interface but have no `add`, `delete`, or `clear` methods.

## Redaction

- `redactValue(value, options)` returns a redacted copy of structured data. `maxDepth`, `maxKeys`, and `maxArray` default to 20, 1,000, and 1,000; non-finite values use the relevant default, finite fractions are floored, and negative values become zero. Reaching the depth limit returns `[TRUNCATED]`; omitted array items add a `[TRUNCATED]` array item, and omitted object keys add a `__truncated` property (with a numeric suffix if that name is already retained). Key limits bound retained property reads; JavaScript still enumerates all own keys to produce the key list.
- `redactHeaders(headers, options)` redacts sensitive header values. Valid entry-array inputs preserve duplicate names; Headers-like iterable inputs return a record where duplicate names collapse to the last redacted value. Malformed entry-array inputs and failures reading or iterating a Headers-like input return an empty entry array.
- `redactText(value, options)` applies best-effort text rules, redacts assignments and query values for configured sensitive `keys` or `redactKeys`, and can receive configured literal `secrets`. Overlapping configured secret matches are replaced as one covered span. Its output is limited to 10,000 characters by default; set `maxOutputLength` to customize the bound. Truncated output ends with `[TRUNCATED]`, or `…` when the configured bound is shorter than that marker.
- `replaceLiteralSecret(value, secret, marker)` replaces literal occurrences in text.

## Safe serialization

`safeSerialize(value, options)` returns a bounded, safe representation for logging and diagnostic use. Serialization options extend policy options with `maxDepth`, `maxKeys`, `maxArray`, and `maxString` limits. For `maxDepth`, `maxKeys`, and `maxArray`, non-finite values use the relevant default, finite fractions are floored, and negative values become zero. Object serialization and structured redaction operate on enumerable string-keyed properties; enumerable symbol-keyed properties are omitted. Sparse arrays preserve holes without reading inherited numeric properties. An enumerable own `__proto__` key is preserved as data and does not change the result prototype. `safeSerialize` and `redactValue` read at most `maxKeys` enumerable property values and perform a key-only lookahead to mark truncation. Enumerable Error `name`, `message`, and `stack` fields count against that same key limit as custom properties, and each is read at most once. When `maxArray` omits items, the result array ends with `[TRUNCATED]`. Omitted object keys add a `__truncated` property, using a numeric suffix if that name is already retained. JavaScript's own-key enumeration supplies a complete list before the value-read bound can be applied. If reading a retained enumerable property fails, serialization returns an empty object instead of a partial result. Structured redaction returns an empty object if reading a retained enumerable own property fails. Configured sensitive keys apply to Error `name`, `message`, and `stack` fields as well as custom properties. The public module exports exactly the declarations listed in `src/index.d.ts`.

The declarations in `src/index.d.ts` describe the public TypeScript surface. Detailed behavior and compatibility boundaries are recorded in [specifications](../specs/README.md).
