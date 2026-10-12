# Get Started

Use Node.js 26 or later and npm 12 or later. Use a project with native ESM support.

## Install

Run this command in your project folder:

```sh
npm install @eliware/redact
```

## Redact structured values

Import the functions that your application needs:

```js
import { redactValue, safeSerialize } from "@eliware/redact";

const event = { user: "alex", token: "example-token" };
console.log(redactValue(event));
console.log(safeSerialize(event));
```

Both calls return an object with `token` set to `[REDACTED]`. They keep the input object unchanged.

`redactValue` checks property names. It does not scan text inside string values. Use `redactText` for text.

## Add sensitive key names

The `keys` option replaces the default key list. Add the default names when you want to extend that list:

```js
import { defaultPolicy, redactValue } from "@eliware/redact";

const options = { keys: [...defaultPolicy.keys, "sessionId"] };
const clean = redactValue({ sessionId: "example-value" }, options);
console.log(clean);
```

The output contains `[REDACTED]` for `sessionId`.

## Redact text

Use `redactText` for common credential patterns and configured literal secrets:

```js
import { redactText } from "@eliware/redact";

const message = redactText("Authorization: Bearer example-token");
console.log(message);
```

The output is `Authorization: [REDACTED]`.

## Use TypeScript

Import from `@eliware/redact`. The package provides declarations for its public functions and options.

Read the [API guide](api.md) for all options and output rules. Run the [basic example](../examples/README.md) for another complete example.
