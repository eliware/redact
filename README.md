# @eliware/redact

Reusable secret-redaction and safe-serialization utilities for Eliware
packages.

## Status

The repository is bootstrapped at version `4.0.0`. The public redaction API is
implemented APIs include policy creation, structured redaction, header
redaction, best-effort text redaction, literal-secret replacement, and safe
serialization.

## API

```js
import {
  redactText,
  redactValue,
  safeSerialize,
} from '@eliware/redact';

redactText('Authorization: Bearer secret');
// 'Authorization: Bearer [REDACTED]'

redactValue({ token: 'secret', safe: true });
// { token: '[REDACTED]', safe: true }

safeSerialize({ token: 'secret', nested: { value: 1 } });
// { token: '[REDACTED]', nested: { value: 1 } }
```

Structured redaction is key-based and does not mutate its input. Text
redaction is best-effort and cannot guarantee detection of unknown secrets.
Configure `keys`, `marker`, and serialization limits for package-specific
contracts.

## Development

```text
npm test
```

The project uses the globally available `eliware-test` command and does not yet
declare `@eliware/test` as a development dependency.

## Design

See [desired_state.md](desired_state.md) for the planned module hierarchy and
the individual files under [specs/](specs/) for intended behavior and scope.
