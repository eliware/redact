# AGENTS.md

## Project

Repository: `eliware/redact`. Purpose: maintain `@eliware/redact`, a Node.js library for secret redaction and safe serialization.

## Scope and boundaries

Project scope and boundaries: this repository owns the library implementation, public API, tests, examples, and package contract. It excludes shared repository requirements maintained by `eliware/test`, organization documentation maintained by `eliware/docs`, and release procedures maintained by `eliware/operations`. The E-101 directive namespace is assigned by `../docs/repo-map.yaml`. The root AGENTS.md applies repository-wide; subdirectory AGENTS.md files apply only in their subdirectories.

## Layout

Required repository structure includes implementation modules under `src/` mirrored by tests under `tests/`, public files `src/index.mjs` and `src/index.d.ts`, user documentation under `docs/`, runnable native ESM examples under `examples/`, and repository-specific directives under `specs/`. The published package allowlist is exactly `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, and `examples/`.

## Development

Before changing files, read the root `README.md`, applicable `AGENTS.md` instructions, and applicable documentation relevant to the change. Use Node.js 26, npm 12 or later, and native ESM `.mjs` modules. The library has no runtime environment settings or configuration files; behavior is controlled by API options. Keep these instructions actionable, current, and concise. Project-specific instructions add requirements without weakening shared requirements unless authorized.

Every source and test module must meet the single responsibility requirement: one cohesive purpose and one reason to change. Business-logic modules and coordinators, including coordinators of coordinators, are valid when each does only its own responsibility. When a distinct responsibility is introduced, create a focused submodule with a mirrored test, then wire it through its owner; do not add the new responsibility to an existing module. Refactor mixed responsibilities during ordinary review; refactor them instead of deferring the split. The 100-line source and 200-line test maxima are separate blocking limits. Passing them does not prove cohesion or permit mixed responsibilities below the maxima.

Repository-wide instructions and subdirectory instructions are scoped separately; subdirectory AGENTS.md files govern their subdirectories.

## Validation

Run `npm ci` after dependency changes and `npm test` for aggregate validation and coverage. Focused commands are `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, and `npm run pack`. `npm run format` writes formatted files; `npm run format:check` is read-only. The pack check must pass and verify the package allowlist before release consideration.

## Security

Keep credentials, tokens, private data, and machine-specific runtime state out of source, tests, examples, and documentation. Use safe placeholders for any future environment template. Redaction is best-effort and is not encryption, secret storage, access control, or a guarantee that arbitrary secrets are detected.

## Changes

Preserve the documented public contract. Update specifications, tests, declarations, documentation, examples, and release notes when applicable. Record only approved deviations. Do not publish, tag, push, or release without the applicable explicit authorization.

## Library

The public runtime entrypoint is `src/index.mjs`; typed declarations are `src/index.d.ts`. Keep exports and declarations synchronized and test the public API. Preserve compatibility defined by `specs/directives.yaml` and `RELEASE_NOTES.md`. Package contents are limited to the allowlist in Layout. Packaging validation uses `npm run pack`; consumer package validation uses `eliware-test --pack` before release consideration. Run `npm run typecheck` and `npm test` as well.

## npm publication

The package identity is `@eliware/redact`; `package.json.version` is the version source and `RELEASE_NOTES.md` records user-visible changes. The package allowlist is `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, and `examples/`. Pack validation command: `npm run pack` (`eliware-test --pack`); the required result is pass with an exact allowlist match. Publication uses npm Trusted Publishing with provenance and an exact `vMAJOR.MINOR.PATCH` tag matching `package.json`, after Ubuntu validation. Eli and the project developer run TagIt preflight together; Eli decides whether the release is ready and instructs DevOps; DevOps executes the authorized release. Exact-version public npm registry verification must confirm that the exact `package.json` version is visible for `@eliware/redact` at `https://registry.npmjs.org/@eliware%2fredact`. Publication requires explicit authorization through the applicable Operations release handoff; this file does not authorize publishing.
