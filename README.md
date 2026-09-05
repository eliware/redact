# @eliware/redact

Reusable secret-redaction and safe-serialization utilities for Eliware
packages.

## Status

The repository is bootstrapped at version `4.0.0`. The public redaction API is
not implemented yet; the intended architecture and behavioral contracts are
being established before implementation.

## Development

```text
npm test
```

The project uses the globally available `eliware-test` command and does not yet
declare `@eliware/test` as a development dependency.

## Design

See [desired_state.md](desired_state.md) for the planned module hierarchy and
the individual files under [specs/](specs/) for intended behavior and scope.
