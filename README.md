# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/redact [![npm](https://img.shields.io/npm/v/@eliware/redact)](https://www.npmjs.com/package/@eliware/redact) [![License](https://img.shields.io/github/license/eliware/redact)](https://github.com/eliware/redact/blob/main/LICENSE) [![CI](https://github.com/eliware/redact/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/redact/actions/workflows/ci.yaml)

Reusable secret-redaction and safe-serialization utilities for Node.js 26.

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

`@eliware/redact` helps packages remove sensitive values before logging, persistence, or transport. It provides policy creation, structured value redaction, HTTP header redaction, best-effort text redaction, literal-secret replacement, and bounded safe serialization. Structured redaction does not mutate input values.

## Requirements

- Node.js 26 or later with native ESM support.
- No runtime environment variables or configuration files are required.

## Setup

Install the package with `npm install @eliware/redact`. The package version is the source version for this checkout. Check npm for the version available to consumers. The public runtime entrypoint is `src/index.mjs`. Its TypeScript declarations are in `src/index.d.ts`.

## Usage

Import the functions your package needs:

```js
import { redactText, redactValue, safeSerialize } from "@eliware/redact";

console.log(redactText("Authorization: Bearer example-token"));
console.log(redactValue({ token: "example-token", safe: true }));
console.log(safeSerialize({ token: "example-token", nested: { value: 1 } }));
```

The default marker is `[REDACTED]`. Use API options to select sensitive keys, markers, and serialization limits. See [Getting started](docs/getting-started.md) for prerequisites, a complete command, and expected output. See [RELEASE_NOTES.md](RELEASE_NOTES.md) for release changes.

## Development

Read [AGENTS.md](AGENTS.md), [docs/README.md](docs/README.md), and [specs/README.md](specs/README.md) before changing the package. Source modules live under `src/`. Each source module has a matching test under `tests/`. Runnable examples are indexed in [examples/README.md](examples/README.md).

## Testing

<!-- codescope ignore this because the installed eliware-test aggregate runs Jest, pack, and typecheck. -->

Run `npm test` for aggregate validation, Jest coverage, package checks, and typechecking. Focused commands are `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, and `npm run pack`. `npm run format` writes formatted files. `npm run format:check` is read-only.

## Troubleshooting

Use Node.js 26 or later and npm 12 or later. If validation fails, fix the reported issue, then run `npm test` again. When you change a public export, update its declaration, tests, documentation, examples, and release notes.

## Security

Redaction is best-effort. It cannot guarantee detection of unknown secrets. It does not replace encryption, secret storage, access control, or application-specific security review. Redact values before you send them to logs, persistence, or transport. Do not include real credentials in examples or issue reports.

## API

The public exports are `createPolicy`, `defaultPolicy`, `redactValue`, `redactHeaders`, `redactText`, `replaceLiteralSecret`, and `safeSerialize`. Type declarations for these exports are published from `src/index.d.ts`. See [API behavior](docs/api.md) and [specs/README.md](specs/README.md) for compatibility and detailed behavior.

## Packaging

The package files are `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, `examples/`, and `specs/`. Run `npm run pack` to check the packed contents. The check compares the package with required paths and exclusions.

Public publication uses npm Trusted Publishing with provenance and a version tag that matches `package.json`. Validate the package on Ubuntu before release consideration. Check npm for the exact published version. A matching tag and successful validation do not authorize publication. Use the Eliware Operations release handoff.

## Examples

See [examples/README.md](examples/README.md) for the runnable native ESM example, its prerequisites, command, and expected result.

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
