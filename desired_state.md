# Desired State

## Source architecture

The library should be fully decomposed into atomic, single-responsibility
modules with a deep responsibility-oriented hierarchy:

## Implementation status

Updated 2026-09-04 after commit `ccafb59` and the first implementation
milestone:

- [x] Repository bootstrap, package metadata, README, license, release notes,
  instructions, and ignore rules.
- [x] Native ESM public entrypoint and explicit package export.
- [x] Policy creation, normalization, default sensitive-key policy, and
  redaction marker.
- [x] Recursive structured-value redaction with non-mutation, nested values,
  arrays, Errors, cycles, and defensive enumeration handling.
- [x] HTTP header redaction for objects, `Headers`, and entry arrays.
- [x] Best-effort text redaction for common credential formats and configured
  literal secrets.
- [x] Mirrored focused tests for every implemented production module.
- [x] `npm test` passes with 100×4 coverage and zero lint warnings.
- [x] `npm pack --dry-run` and `git diff --check` pass.
- [x] Safe serialization with defensive handling for complex, circular, and
  hostile values.
- [x] Initial limits module and bounded serialization behavior.
- [x] Error-specific public helpers for messages, structured details, and safe
  error values.
- [x] Type declarations and TypeScript configuration; direct declaration
  validation passes with the locally installed compiler. A package `typecheck`
  script remains deferred because the current global `eliware-test` Windows
  runner cannot spawn npm for that lifecycle hook.
- [x] README API documentation and runnable examples for the current public
  surface.
- [x] CI workflow and package-file review; local `npm test`, direct TypeScript
  declaration validation, package dry-run, and diff checks pass.
- [x] Extracted dedicated inspection and limit modules and integrated them into
  safe serialization with mirrored tests.
- [x] Decomposed the text redactor into dedicated private-key, authorization,
  bearer, query-secret, named-assignment, provider-token, and JWT rule modules.
- [x] Extracted serializer composition modules for arrays, objects, circular
  values, and unserializable values, with mirrored tests.
- [x] Extracted dedicated primitive and Error serialization modules with
  mirrored tests.
- [x] Extracted marker creation/formatting and primitive serializers for
  functions, symbols, BigInts, and undefined values.
- [x] Decomposed structured redaction into dedicated object, array, property,
  key, Error, entry-reader, copy, and cycle-handling modules with mirrored
  tests.
- [x] Decomposed header redaction into entry-reading, header-name policy, and
  header-value modules with mirrored tests.
- [x] Added the remaining policy metadata, serialization-limit, plain-object,
  own-value, and buffer modules with mirrored tests.
- [x] Added and consumed the final `serialize-value` dispatch module; the
  desired source tree now has a mirrored test module for every production
  module.
- [x] Final API and architecture audit: all desired source files are present,
  all source modules have mirrored tests, and the public entrypoint remains
  thin and explicit.

```text
.
├── AGENTS.md
├── README.md
├── LICENSE
├── RELEASE_NOTES.md
├── package.json
├── package-lock.json
├── index.d.ts
├── .gitignore
├── .npmignore
├── desired_state.md
├── specs/
│   ├── architecture.md
│   ├── policy.md
│   ├── structured-redaction.md
│   ├── text-redaction.md
│   ├── headers.md
│   ├── serialization.md
│   ├── limits.md
│   ├── security.md
│   ├── compatibility.md
│   └── out-of-scope.md
├── tests/
│   └── ...
├── src/
│   └── ...
└── .github/
    └── workflows/
        └── ci.yml
```

The following files and directories are part of the desired project shape:

```text
src/
├── index.mjs
│
├── policy/
│   ├── default-policy.mjs
│   ├── default-key-names.mjs
│   ├── default-text-rules.mjs
│   ├── create-policy.mjs
│   ├── normalize-policy.mjs
│   └── policy-types.mjs
│
├── markers/
│   ├── default-marker.mjs
│   ├── create-marker.mjs
│   └── format-redaction-marker.mjs
│
├── structured/
│   ├── redact-value.mjs
│   ├── redact-object.mjs
│   ├── redact-array.mjs
│   ├── redact-error.mjs
│   ├── redact-property.mjs
│   ├── redact-key.mjs
│   ├── redact-string-property.mjs
│   ├── copy-property-descriptor.mjs
│   ├── object-entry-reader.mjs
│   └── circular-reference-handler.mjs
│
├── headers/
│   ├── redact-headers.mjs
│   ├── header-entry-reader.mjs
│   ├── header-name-policy.mjs
│   └── header-value-redactor.mjs
│
├── text/
│   ├── redact-text.mjs
│   ├── apply-text-rules.mjs
│   ├── replace-literal-secret.mjs
│   │
│   ├── rules/
│   │   ├── redact-authorization.mjs
│   │   ├── redact-bearer-token.mjs
│   │   ├── redact-named-assignment.mjs
│   │   ├── redact-json-secret.mjs
│   │   ├── redact-query-secret.mjs
│   │   ├── redact-provider-token.mjs
│   │   ├── redact-private-key.mjs
│   │   ├── redact-public-key.mjs
│   │   ├── redact-jwt.mjs
│   │   ├── redact-opaque-secret.mjs
│   │   └── redact-hex-secret.mjs
│   │
│   └── patterns/
│       ├── secret-key-patterns.mjs
│       ├── authorization-patterns.mjs
│       ├── provider-token-patterns.mjs
│       └── key-material-patterns.mjs
│
├── serialization/
│   ├── safe-serialize.mjs
│   ├── serialize-value.mjs
│   ├── serialize-object.mjs
│   ├── serialize-array.mjs
│   ├── serialize-error.mjs
│   ├── serialize-function.mjs
│   ├── serialize-symbol.mjs
│   ├── serialize-bigint.mjs
│   ├── serialize-buffer.mjs
│   ├── serialize-undefined.mjs
│   ├── circular-value.mjs
│   ├── unserializable-value.mjs
│   └── serialization-limits.mjs
│
├── limits/
│   ├── default-limits.mjs
│   ├── enforce-depth-limit.mjs
│   ├── enforce-key-limit.mjs
│   ├── enforce-array-limit.mjs
│   └── enforce-string-limit.mjs
│
├── inspection/
│   ├── is-plain-object.mjs
│   ├── is-error.mjs
│   ├── is-buffer.mjs
│   ├── is-object-like.mjs
│   ├── read-own-value.mjs
│   └── read-safe-entries.mjs
│
└── errors/
    ├── redact-error-message.mjs
    ├── redact-error-details.mjs
    └── safe-error-value.mjs
```

## Public entrypoint

`src/index.mjs` should expose only stable public contracts:

```js
export { createPolicy } from './policy/create-policy.mjs';
export { defaultPolicy } from './policy/default-policy.mjs';

export { redactValue } from './structured/redact-value.mjs';
export { redactHeaders } from './headers/redact-headers.mjs';
export { redactText } from './text/redact-text.mjs';
export { replaceLiteralSecret } from './text/replace-literal-secret.mjs';
export { safeSerialize } from './serialization/safe-serialize.mjs';
```

## Repository files

### `AGENTS.md`

Repository-local instructions. It should identify the package as a reusable
Node.js library, repeat applicable source/test architecture rules, define
validation commands, prohibit secrets and runtime state, and document any
intentional convention exceptions.

### `README.md`

The canonical user and maintainer guide. It should cover purpose, supported
runtime, installation, public API, examples, default policy, limitations,
security expectations, testing, packaging, and contribution/release notes.

Examples must be runnable, safe, and free of real credentials or machine-local
paths.

### `LICENSE`

The repository's applicable Eliware license text.

### `RELEASE_NOTES.md`

User-visible changes by version. Release preparation must follow the exact
version approval gate in the Eliware release flow.

### `package.json`

Must define native ESM, package metadata, explicit public `exports`, files
allowlisting, runtime compatibility, scripts, dependencies, development
dependencies, and declaration metadata where applicable.

Required baseline scripts:

```json
{
  "test": "eliware-test",
  "lint": "eliware-test --lint",
  "typecheck": "...",
  "pack": "npm pack --dry-run"
}
```

The exact `typecheck` command depends on the declaration strategy selected for
the package.

### `package-lock.json`

The committed npm lockfile, kept synchronized with `package.json`.

### `index.d.ts`

Type declarations for every public export when the package publishes
declarations. The declarations, implementation, README examples, and
`package.json` metadata must remain synchronized.

### `.gitignore` and `.npmignore`

Exclude local environment files, credentials, runtime state, coverage output,
build output, temporary files, and other non-publishable material. The npm
allowlist in `package.json` remains the primary publication boundary.

### `.github/workflows/ci.yml`

CI should validate every pull request, `main` push, and `v*` tag on Ubuntu with
`npm ci`, `npm test`, `npm run lint`, audit, and `npm pack --dry-run`. Publication
must be a separate tag-only job and must not run from a branch push.

The workflow should keep `contents: read` at workflow scope and grant
`id-token: write` only to a publication job if trusted publishing is used.

### `.knit/deploy.yaml`

Only required if this library is explicitly managed or synchronized by Knit.
If added, it must define reviewed targets, working directories, and ordered
commands. A reusable package should not include deployment scaffolding merely
because the platform supports Knit.

## Specifications

The `specs/` directory is the durable behavioral contract for the library.
Each specification should be single-purpose, concise, implementation-neutral
where practical, and linked from the README when it is useful to consumers.

### `specs/architecture.md`

Defines responsibility boundaries, public versus internal modules, the
mirrored source/test hierarchy, and composition rules.

### `specs/policy.md`

Defines the policy model, default sensitive-key families, custom policy
configuration, marker behavior, normalization, and precedence rules.

### `specs/structured-redaction.md`

Defines recursive value redaction, non-mutation, nested objects, arrays,
Errors, null-prototype objects, cycles, access failures, and unsupported values.

### `specs/text-redaction.md`

Defines best-effort text redaction, supported credential formats, rule ordering,
literal secret replacement, false-positive expectations, and marker stability.

### `specs/headers.md`

Defines header input forms, sensitive header names, case handling, preservation
of safe headers, and output shape.

### `specs/serialization.md`

Defines safe serialization of complex or hostile values, including functions,
symbols, BigInts, buffers, Errors, circular references, and unserializable
properties.

### `specs/limits.md`

Defines depth, key, array, string, and text-output limits, truncation markers,
and the difference between confidentiality redaction and output bounding.

### `specs/security.md`

Defines the security model, best-effort limitations, no-secret-leakage
expectations, input non-mutation, safe defaults, and required regression cases.

### `specs/compatibility.md`

Defines Node.js support, native ESM requirements, public export stability,
declaration compatibility, SemVer expectations, and migration guarantees.

### `specs/out-of-scope.md`

Explicitly excludes HTML sanitization, SQL identifier sanitization, filesystem
path sanitization, input validation, encryption, secret storage, secret
scanning, access control, authorization, data loss prevention, and
memory/AddressSanitizer functionality.

## Responsibility boundaries

- `policy/` decides what is sensitive.
- `structured/` transforms objects without mutation.
- `headers/` handles HTTP-shaped data.
- `text/` performs best-effort pattern replacement.
- `serialization/` safely converts hostile or complex values.
- `limits/` controls output size and traversal.
- `inspection/` isolates defensive object access.
- `errors/` handles error-specific redaction.
- `index.mjs` exposes the stable public API and remains thin.

## Mirrored tests

The test tree must mirror the source hierarchy exactly:

```text
tests/
├── policy/
├── structured/
├── headers/
├── text/
├── serialization/
├── limits/
├── inspection/
└── errors/
```

Each production module should have one corresponding test module. Higher-level
tests belong only at the lowest composition boundary that genuinely requires
multiple modules.

## Design constraints

- Preserve input values; never mutate caller-owned data.
- Use `[REDACTED]` as the default marker.
- Support nested objects, arrays, Errors, cycles, null-prototype objects,
  throwing getters, and hostile proxies.
- Keep key-based redaction distinct from best-effort text redaction.
- Keep truncation and serialization limits distinct from confidentiality rules.
- Avoid broad high-entropy matching in the default policy when it creates
  unacceptable false positives.
- Keep HTML sanitization, SQL identifier sanitization, path sanitization, and
  memory/ASAN sanitizers outside this package.
