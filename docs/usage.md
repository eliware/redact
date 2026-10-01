# Usage

[Back to the project README](../README.md)

Import the public functions from `@eliware/redact` and apply them before
logging, persistence, or transport. Use `redactText` for text, `redactValue`
for structured values, and `safeSerialize` when bounded serialization is
required. `safeSerialize` also accepts `secrets` to replace up to 100 literal
secrets wherever string values occur in the serialized result.

Use `redactHeaders` before forwarding or recording HTTP headers, and use the
error helpers to produce safe diagnostics:

```js
import { redactHeaders, safeErrorValue } from "@eliware/redact";

const headers = redactHeaders({
  Authorization: "Bearer example-token",
  Accept: "application/json",
});
const error = safeErrorValue(new Error("Request failed with token=example-token"));
```
