# Usage

[Back to the project README](../README.md)

Import the public functions from `@eliware/redact` and apply them before
logging, persistence, or transport. Use `redactText` for text, `redactValue`
for structured values, and `safeSerialize` when bounded serialization is
required. `safeSerialize` also accepts `secrets` to replace the first 100
non-empty string entries wherever string values occur in the serialized result;
empty strings and non-string entries are ignored and do not count toward the
limit. Replacements always use the fixed `[REDACTED]` marker.

Use `redactHeaders` before forwarding or recording HTTP headers, and use the
error helpers to produce safe diagnostics. Header names must be strings;
malformed entries and entries with non-string names are skipped. A
Headers-style `entries()` source is bounded to its first 1,000 yielded entries,
with later entries omitted and no truncation marker or truncation-status field:

```js
import { redactHeaders, safeErrorValue } from "@eliware/redact";

const headers = redactHeaders({
  Authorization: "Bearer example-token",
  Accept: "application/json",
});
const error = safeErrorValue(new Error("Request failed with token=example-token"));
```
