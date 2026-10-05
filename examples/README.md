# Examples

## Basic text redaction

Purpose: show how to redact an authorization value before writing text to diagnostic output.

Prerequisites: Node.js 26 and the package dependency tree installed with `npm ci`.

Command: `node examples/basic.mjs`.

Expected result: the command prints `token=[REDACTED]`.

- [basic.mjs](basic.mjs): runnable basic text redaction example.
