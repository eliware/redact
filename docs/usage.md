# Usage

[Back to the project README](../README.md)

Import the public functions from `@eliware/redact` and apply them before
logging, persistence, or transport. Use `redactText` for text, `redactValue`
for structured values, and `safeSerialize` when bounded serialization is
required.
