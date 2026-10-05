# Getting Started

Install `@eliware/redact` in a Node.js 26 ESM project, then import the functions needed by the application.

```js
import { redactValue, safeSerialize } from "@eliware/redact";

const event = { user: "alex", apiToken: "example-token" };
console.log(redactValue(event));
console.log(safeSerialize(event));
```

The input object is left unchanged. Sensitive values are replaced with `[REDACTED]` according to the default policy. Configure policy options when a package has additional sensitive key names, literal secrets, or serialization limits.

The runnable [basic example](../examples/README.md) demonstrates text redaction without credentials or external services.
