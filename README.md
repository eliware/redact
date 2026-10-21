# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/redact [![npm](https://img.shields.io/npm/v/@eliware/redact)](https://www.npmjs.com/package/@eliware/redact) [![License](https://img.shields.io/github/license/eliware/redact)](https://github.com/eliware/redact/blob/main/LICENSE) [![CI](https://github.com/eliware/redact/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/redact/actions/workflows/ci.yaml)

Secret-redaction and safe-serialization utilities for Node.js 26.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [API](#api)
- [Packaging](#packaging)
- [Examples](#examples)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

`@eliware/redact` redacts structured values, HTTP headers, and supported text patterns. It replaces configured literal secrets and serializes values with depth, key, array, and string limits. Structured redaction does not change input values.

## Requirements

Use Node.js 26 or later. The package uses native ESM.

## Setup

Install the package with `npm install @eliware/redact`. The JavaScript entrypoint is `src/index.mjs`. TypeScript declarations are in `src/index.d.ts`.

## Usage

Import the functions that your application needs:

```js
import { redactText, redactValue, safeSerialize } from "@eliware/redact";

console.log(redactText("Authorization: Bearer example-token"));
console.log(redactValue({ token: "example-token", safe: true }));
console.log(safeSerialize({ token: "example-token", nested: { value: 1 } }));
```

Read the [getting started guide](docs/getting-started.md) for setup steps. Read the [release notes](RELEASE_NOTES.md) for version changes.

## Development

Read the [specifications](specs/README.md) before you change public behavior.

## Testing

Run `npm test` for aggregate validation. Run `npm run lint`, `npm run audit`, and `npm run format` for focused checks.
Run `npm run format:check`, `npm run typecheck`, and `npm run pack` for focused checks.

## Troubleshooting

Read the error output to identify a failed check.

## Security

Redaction is best-effort. It cannot guarantee detection of unknown secrets. It does not replace encryption, secret storage, or access control. Redact values before you send them to logs, storage, or transport.

## API

The public functions are `createPolicy`, `defaultPolicy`, `redactValue`, `redactHeaders`, `redactText`, `replaceLiteralSecret`, and `safeSerialize`. Read the [documentation index](docs/README.md) and [API guide](docs/api.md) for options and behavior. Read the [specifications](specs/README.md) for the behavior contract.

## Packaging

The package contains `src/`, `docs/`, `examples/`, and `specs/`, plus `README.md`, `AGENTS.md`, `LICENSE`, and `RELEASE_NOTES.md`. Run `npm run pack` to check package contents.

Publication uses npm Trusted Publishing with provenance and a version tag that matches `package.json`. Validation and a matching tag do not authorize publication. Follow the Eliware Operations release handoff.

## Examples

See the [example guide](examples/README.md) for the command and expected output.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/redact)
- [Bug Reports](https://github.com/eliware/redact/issues)
- [npm](https://www.npmjs.com/package/@eliware/redact)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
