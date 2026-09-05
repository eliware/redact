# Limits

Traversal depth, object keys, array items, string size, and text output size
must be bounded. The default `maxString` limit is 10,000 characters and applies
to serialized string values and `redactText` output. Text truncation uses
`[TRUNCATED]`, while redaction uses `[REDACTED]`. If the configured limit is
shorter than the truncation marker, output remains bounded without a complete
marker because both requirements cannot fit simultaneously.
