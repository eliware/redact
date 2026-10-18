# Safe Use and Limits

Redaction can lower accidental disclosure in logs and diagnostic output. It provides best-effort results. It does not provide a protective boundary.

## What the package does

- Structured redaction replaces values under configured sensitive property names.
- Header redaction applies the same key rules to header names.
- Text redaction checks known credential patterns and configured key names.
- Literal-secret replacement checks only the values that you provide.
- Safe serialization limits output length and replaces some complex values with labels.

## What the package cannot do

The package may miss secrets. Text rules may not find unknown formats. They can also redact text that is not secret.

Output limits control output length. They do not hide values that the redaction rules do not match.

The package does not encrypt, store, or control access to data. It does not replace access control, encryption, retention rules, or inspection by your team.

## Safe use

- Redact values before you send them to logs, storage, transport, or a browser.
- Add sensitive property names that your application uses.
- Supply literal secrets when pattern rules do not cover them.
- Examine the output before you share it outside your application.
- Prevent exposure of source values with the controls that your system requires.
- Use fake values in source code, tests, examples, documentation, and issue reports.

Read the [API guide](api.md) for supported rules and limits. Read the [specifications](../specs/README.md) for the full behavior contract.
