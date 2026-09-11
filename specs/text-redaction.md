# Text Redaction

Text redaction is best-effort. It covers common credential forms such as
authorization and bearer values, named assignments, environment assignments,
query secrets, provider tokens, JWTs, public/private key material, and opaque
secrets. It must document supported patterns and must
not claim to detect arbitrary unknown secrets.

`redactText` accepts `maxString`, a non-negative integer defaulting to 10,000.
The returned text never exceeds that limit. If input or redaction expansion
requires truncation, `[TRUNCATED]` is appended whenever the limit can fit it;
this marker is distinct from the fixed `[REDACTED]` sensitive-value marker.

Sensitive-value replacements always use the fixed `[REDACTED]` marker; marker
customization is not supported.

The optional `secrets` value must be iterable; its non-empty string entries are
replaced literally, while non-string entries are ignored.
