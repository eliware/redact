# Text Redaction

Text redaction is best-effort. It covers common credential forms such as
authorization and bearer values, named assignments, query secrets, provider
tokens, JWTs, and key material. It must document supported patterns and must
not claim to detect arbitrary unknown secrets.

`redactText` accepts `maxString`, a non-negative integer defaulting to 10,000.
The returned text never exceeds that limit. If input or redaction expansion
requires truncation, `[TRUNCATED]` is appended whenever the limit can fit it;
this marker is distinct from `[REDACTED]`.
