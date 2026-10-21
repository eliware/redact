# AGENTS.md

## Project

Maintain `@eliware/redact` for Eliware. The package redacts sensitive values in Node.js.

## Scope and boundaries

Keep public behavior in `specs/directives.yaml` and user guidance in `docs/`.

## Layout

Use `src/` for implementation modules, `tests/` for tests, and `docs/` for user guides.

## Development

Keep each source and test module focused on one purpose.

## Validation

Use Node.js 26 or later.
Use native ESM for maintained JavaScript modules.
Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.

Run `npm run format` to format files.
Run `npm run format:check` to check formatting.

## Security

Keep credentials, secret values, private data, and runtime state out of Git.

## Changes

Update the specifications and user documentation when public behavior changes.

## Library

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## npm publication

Use the approved release process for npm publication.
