# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

@eliware/redact [![npm](https://img.shields.io/npm/v/@eliware/redact)](https://www.npmjs.com/package/@eliware/redact) [![License](https://img.shields.io/github/license/eliware/redact)](https://github.com/eliware/redact/blob/main/LICENSE) [![CI](https://github.com/eliware/redact/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/redact/actions/workflows/ci.yaml)

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
- [License](#license)
- [Links](#links)

## Features

Reusable secret-redaction and safe-serialization utilities for Node.js 26. `@eliware/redact` helps Eliware packages remove sensitive values before logging, persistence, or transport. The package owns a focused library API; callers own their application policies and decide where redaction belongs in their data flow.

Purpose: `@eliware/redact` provides reusable secret-redaction and safe-serialization utilities for Node.js 26.

Author: Eliware <eliware@eliware.org>. License: MIT.

It provides policy creation, structured value redaction, HTTP header redaction, best-effort text redaction, literal-secret replacement, and bounded safe serialization. Structured redaction does not mutate input values.

Documentation: [docs](docs/README.md) · [specifications](specs/README.md)

## Requirements

- Node.js 26 with native ESM support.
- No runtime environment variables or configuration files are required.

## Setup

Install the package with `npm install @eliware/redact`. The package version is the source version for this checkout; check the npm registry for the published version available to consumers. The public runtime entrypoint is `src/index.mjs`; its TypeScript declarations are in `src/index.d.ts`.

## Usage

Import the functions your package needs:

```js
import { redactText, redactValue, safeSerialize } from "@eliware/redact";

console.log(redactText("Authorization: Bearer example-token"));
console.log(redactValue({ token: "example-token", safe: true }));
console.log(safeSerialize({ token: "example-token", nested: { value: 1 } }));
```

The default marker is `[REDACTED]`. Use API options to select sensitive keys, markers, and serialization limits. See [Getting started](docs/getting-started.md) for prerequisites, a complete command, and expected output.

## Development

Read [AGENTS.md](AGENTS.md), [docs/README.md](docs/README.md), and [specs/README.md](specs/README.md) before changing the package. Source modules live under `src/`; each has a matching test under `tests/`. Runnable examples are indexed in [examples/README.md](examples/README.md).

## Testing

Run `npm test` for aggregate validation, Jest coverage, package checks, and typechecking. Focused validation commands are `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, and `npm run pack`. `npm run format` writes canonical formatting; `npm run format:check` is read-only.

## Troubleshooting

Use Node.js 26 and npm 12 or later. If validation fails, address the reported stage, then rerun `npm test`. When changing a public export, update its declaration, tests, documentation, examples, and release notes together.

## Security

Redaction is best-effort. It cannot guarantee discovery of unknown secrets and does not replace encryption, secret storage, access control, or application-specific security review. Redact values before sending them to logs, persistence, or transport, and avoid including real credentials in examples or issue reports.

## API

The public exports are `createPolicy`, `defaultPolicy`, `redactValue`, `redactHeaders`, `redactText`, `replaceLiteralSecret`, and `safeSerialize`. Type declarations for these exports are published from `src/index.d.ts`. See [API behavior](docs/api.md) and the specifications for compatibility and detailed behavior.

## Packaging

The package allowlist is `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, and `examples/`. Run `npm run pack`; the harness pack check must pass and verify the packed contents against this allowlist before release consideration.

Public publication uses npm Trusted Publishing with provenance and an exact version tag matching `package.json`, after Ubuntu validation. Check the registry for the exact published version. A matching tag and successful validation do not authorize publication; use the applicable Operations release handoff.

## Examples

See [examples/README.md](examples/README.md) for the runnable native ESM example, its prerequisites, command, and expected result.

## Support

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

Use the [Eliware Discord community](https://discord.gg/M6aTR9eTwN), [GitHub issues](https://github.com/eliware/redact/issues), or [eliware@eliware.org](mailto:eliware@eliware.org). Include the relevant API and a concise description when requesting help.

## License

MIT. See [LICENSE](LICENSE).

## Links

- [docs](docs/README.md)
- [Home Page](https://github.com/eliware/redact#readme)
- [GitHub repository](https://github.com/eliware/redact.git)
- [Eliware](https://eliware.org)
- [GitHub organization](https://github.com/eliware)
- [Discord](https://discord.gg/M6aTR9eTwN)
- [specifications](specs/README.md)
- [Release Notes](RELEASE_NOTES.md)
- [npm Package](https://www.npmjs.com/package/@eliware/redact)
