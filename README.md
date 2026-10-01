# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/redact [![npm version](https://img.shields.io/npm/v/@eliware/redact.svg)](https://www.npmjs.com/package/@eliware/redact) [![license](https://img.shields.io/github/license/eliware/redact.svg)](LICENSE) [![CI](https://github.com/eliware/redact/actions/workflows/ci.yml/badge.svg)](https://github.com/eliware/redact/actions/workflows/ci.yml)

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

Purpose: `@eliware/redact` provides reusable secret-redaction and safe-serialization utilities for Node.js 26+. Use it to reduce sensitive values before logging, persistence, or transport. Redaction is best-effort; it is not encryption, secret storage, or a guarantee that unknown secrets are detected.

The package description is: Reusable secret-redaction and safe-serialization utilities for Node.js 26+.

- Redacts structured values, headers, text, and error details.
- Replaces configured literal secrets and safely serializes supported values.
- Bounds serialization and handles hostile objects without mutating input.

Maintained by Eliware <eliware@eliware.org>. Author: Eliware <eliware@eliware.org>. License: MIT. See [LICENSE](LICENSE).

Documentation: [docs](docs/README.md) · [specifications](specs/README.md) · [examples](examples/README.md)

## Requirements

- Node.js 26.x with native ESM support.
- No environment variables or runtime configuration files are required.

## Setup

Install the public package with `npm install @eliware/redact`. The runtime package entrypoint is `@eliware/redact`, backed by `src/index.mjs`; TypeScript declarations are provided by `index.d.ts`. This checkout declares its version in `package.json`; check the npm registry for the currently published version before selecting a release.

### Configuration

The library has no environment-variable or configuration-file settings. Supply policy options such as `keys`, `maxDepth`, `maxKeys`, and `maxArray` to the relevant API. `safeSerialize` accepts its own `maxString` limit. These API options are runtime configuration; `package.json` metadata and deployment settings are not.

## Usage

Import the public functions from `@eliware/redact` and redact values before they cross a logging or persistence boundary:

```js
import {
  redactHeaders,
  redactText,
  redactValue,
  safeErrorValue,
  safeSerialize,
} from "@eliware/redact";

const text = redactText("Authorization: Bearer example-token");
const value = redactValue({ token: "example-token", safe: true });
const serialized = safeSerialize({ token: "example-token", nested: { value: 1 } });
const headers = redactHeaders({
  Authorization: "Bearer example-token",
  Accept: "application/json",
});
const error = safeErrorValue(new Error("Request failed with token=example-token"));
```

The public package entrypoint is `@eliware/redact`, with runtime entry `src/index.mjs` and declarations in `index.d.ts`. This repository's package version is declared in `package.json`; use a version after its release and publication. The default marker is `[REDACTED]`. Structured redaction is key-based, does not mutate its input, and supports bounded traversal. Text redaction is best-effort and may not recognize unknown secret formats. See the [usage guide](docs/usage.md) and [basic example](examples/basic/README.md).

## Development

Read [AGENTS.md](AGENTS.md), [documentation](docs/README.md), and [specifications](specs/README.md) before changing the package. Install the locked dependencies with `npm ci`. Source modules live under `src/` and their behavior tests mirror them under `tests/`.

## Testing

Run `npm test` for aggregate validation and coverage. Use `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, and `npm run pack` for the applicable focused checks. `npm run format` writes formatted files; `npm run format:check` is read-only.

## Troubleshooting

- Import the package entrypoint `@eliware/redact`; internal `src/` modules are not separately exported.
- Unsupported options throw `TypeError`; see the [specifications](specs/README.md) for accepted behavior.
- If a value is not redacted, configure the applicable key or literal secret and review the documented best-effort limits. Do not include real secrets in an issue report.

## Security

Redaction is not encryption, access control, or guaranteed detection of unknown secrets. Redact values before logging, persistence, or transport. Keep credentials out of source, tests, examples, and version control; `.env.example` contains only safe placeholders.

## API

The package exports policy creation, structured-value redaction, header redaction, text redaction, literal-secret replacement, safe serialization, and error helpers. The supported exports and TypeScript declarations are listed in [src/index.mjs](src/index.mjs) and [index.d.ts](index.d.ts). Compatibility behavior is specified in [Compatibility](specs/compatibility.md); removed or undocumented aliases are not part of the contract.

## Packaging

The intentional package allowlist is `src/`, `index.d.ts`, `README.md`, `docs/`, `examples/`, `specs/`, `LICENSE`, and `RELEASE_NOTES.md`. Validate packed contents with `npm run pack`; the shared pack check must pass and the packed files must match the allowlist before release consideration. Public publication uses npm provenance and an exact version tag matching `package.json`, after Ubuntu validation. Verify the exact version in the npm registry after an explicitly authorized publication handoff.

## Examples

The runnable examples and their prerequisites are indexed in [examples/README.md](examples/README.md). Start with the [basic example](examples/basic/README.md), which runs with placeholder values and no credentials.

## Support

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

Use the [Eliware Discord community](https://discord.gg/M6aTR9eTwN), [GitHub issues](https://github.com/eliware/redact/issues), or [eliware@eliware.org](mailto:eliware@eliware.org). Include redacted context only; never include real secrets in a support request.

## License

MIT. See [LICENSE](LICENSE).

## Links

- [Eliware home](https://eliware.org)
- [Eliware GitHub organization](https://github.com/eliware)
- [Discord](https://discord.gg/M6aTR9eTwN)
- [GitHub repository](https://github.com/eliware/redact) (`git+https://github.com/eliware/redact.git`)
- [npm package](https://www.npmjs.com/package/@eliware/redact)
- [Documentation](docs/README.md)
- [Specifications](specs/README.md)
- [Canonical repository profile specifications](https://github.com/eliware/test/blob/main/specs/conventions/README.md)
- [Runnable examples](examples/README.md)
- [Release notes](RELEASE_NOTES.md)
