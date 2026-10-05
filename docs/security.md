# Security and Limitations

Redaction helps prevent accidental disclosure in logs and diagnostic output. It is not a security boundary by itself.

Structured redaction uses configured sensitive keys. Text redaction recognizes common credential patterns and configured literal secrets, but it cannot identify every unknown secret. Safe serialization limits output and handles complex values; it does not encrypt or store data securely.

Callers remain responsible for choosing where to redact, protecting source values, and applying access control, encryption, retention, and transport protections appropriate to their systems. Do not put real credentials in source code, tests, examples, documentation, or issue reports.
