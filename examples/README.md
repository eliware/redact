# Examples

[Project README](../README.md) · [Documentation](../docs/README.md)

Purpose: demonstrate the public `@eliware/redact` API with safe placeholder values.

Prerequisites: Node.js 26 or newer; install repository dependencies with `npm ci` from the repository root. Examples do not require credentials. Expected result: commands print redacted text and safe serialized values.

## Runnable examples

- [Basic runnable entry](basic.mjs)
- [basic](basic/README.md)
- [basic.mjs](basic.mjs)
- [Basic example guide](basic/README.md)
- [Basic example source](basic/index.mjs)

Run the example from the repository root:

```sh
node examples/basic/index.mjs
```

The same runnable example is available through `node examples/basic.mjs`.

Expected output contains `[REDACTED]` markers for placeholder token values.
