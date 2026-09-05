# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/redact [![npm](https://img.shields.io/npm/v/%40eliware%2Fredact)](https://www.npmjs.com/package/@eliware/redact) [![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![CI](https://github.com/eliware/redact/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/redact/actions/workflows/nodejs.yml)

Reusable secret-redaction and safe-serialization utilities for Node.js 26+.
This library helps protect observability and boundary data; it is not
encryption, secret storage, or a guarantee that unknown secrets are detected.

## Contents

- [Installation](#installation)
- [Requirements](#requirements)
- [API](#api)
- [Configuration](#configuration)
- [Development](#development)
- [Security](#security)
- [Design](#design)
- [Support](#support)
- [License](#license)

## Installation

```sh
npm install @eliware/redact
```

## Requirements

Node.js 26 or newer with native ESM support is required.

## Status

The repository is at version `6.0.0`. The public API includes
policy creation, structured redaction, header redaction, best-effort text
redaction, literal-secret replacement, safe serialization, and error helpers.

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

## Configuration

Structured redaction is key-based and does not mutate its input. Text
redaction is best-effort and cannot guarantee detection of unknown secrets.
Configure `keys`, `marker`, `circularMarker`, and serialization limits
(`maxDepth`, `maxKeys`, `maxArray`, and `maxString`) for package-specific
contracts.
Serialization limits must be non-negative integers.
Structured redaction also accepts non-negative integer `maxDepth`, `maxKeys`,
and `maxArray` limits; exceeding a limit emits `[TRUNCATED]`.
Header-name heuristics can be disabled with `matchHeuristics: false` when
custom header policy must be exact. Custom `headerNames` are additive to the
default heuristic matching unless heuristics are disabled.
The supported runtime is Node.js 26 or newer; browser use does not provide
Node `Buffer` serialization behavior.

Structured redaction is intentionally loss-tolerant for hostile objects: if
property enumeration fails, unavailable fields are omitted from the safe result.
Safe serialization similarly reduces unsupported class instances and built-in
objects to safely readable enumerable own properties; hostile state may be
omitted by design.
Literal-secret replacement processes at most 100 configured secrets per call.
When bounded serialization omits array items, it appends `[TRUNCATED]`; object
truncation uses a collision-safe metadata key.

Additional boundary helpers are available for common logging paths:

```js
redactHeaders({ authorization: 'Bearer secret', accept: 'json' });
redactErrorMessage(new Error('request token=secret'));
redactErrorDetails(Object.assign(new Error('failed'), { token: 'secret' }));
safeErrorValue(new Error('failed'));
```

The same helpers are exported from the package entrypoint; serialization-only
limits are options to `safeSerialize`, not properties of `defaultPolicy`.

Configured literal secrets must be non-empty strings and are replaced using
substring semantics. Buffer handling is intentionally Node.js-specific.
Text redaction and error-message redaction accept only `marker` and `secrets`;
structured/header policy fields do not apply to those helpers. Header
enumeration failures are intentionally loss-tolerant and produce an empty safe
result, as hostile input cannot be represented reliably.
When both `keys` and the legacy `redactKeys` alias are supplied, `keys` takes
precedence; unknown policy fields are ignored by normalized policies.

## Development

```text
npm test
npm run lint
npm run typecheck
npm run pack
```

The project uses `@eliware/test` for its test and lint gates.

## Security

Redaction is an observability and boundary-safety aid, not encryption, secret
storage, access control, or a guarantee that unknown secrets are detected.
Redact values before logging, persistence, transport, or browser delivery.

## Design

See [documentation](docs/README.md), [specifications](specs/README.md),
[examples](examples/README.md), and [release notes](RELEASE_NOTES.md).

## Support

Report reproducible issues at [github.com/eliware/redact/issues](https://github.com/eliware/redact/issues).

## License

This package is distributed under the terms in [LICENSE](LICENSE).
