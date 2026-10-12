# Security and Limits

Redaction can reduce accidental disclosure in logs and diagnostic output. It is best effort. It does not provide a security boundary.

## What the package does

- Structured redaction replaces values under configured sensitive property names.
- Header redaction applies the same key rules to header names.
- Text redaction checks common credential patterns and configured key names.
- Literal-secret replacement checks only the values that you provide.
- Safe serialization limits output size and replaces some complex values with labels.

## What the package cannot do

The package cannot detect every secret. Text rules can miss unknown formats. They can also redact text that is not secret.

Output limits control size. They do not hide values that the redaction rules do not match.

The package does not encrypt, store, or control access to data. It does not replace access control, encryption, retention rules, or security review.

## Safe use

- Redact values before you send them to logs, storage, transport, or a browser.
- Add sensitive property names that your application uses.
- Supply literal secrets when pattern rules do not cover them.
- Review the output before you share it outside your application.
- Protect source values with the controls that your system requires.
- Use fake values in source code, tests, examples, documentation, and issue reports.

Read the [API guide](api.md) for supported rules and limits. Read the [specifications](../specs/README.md) for the full behavior contract.
