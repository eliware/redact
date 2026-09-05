# @eliware/redact

Applies to: the entire repository.

Reusable secret-redaction and safe-serialization library for Eliware packages.

## Development

- Use Node.js 26 and native ESM.
- Keep production code under `src/` and mirror it under `tests/`.
- Keep modules atomic and responsibility-oriented.
- Run `npm test` before reporting work complete.
- Run `npm run lint`, `npm run typecheck`, and `npm run pack` for release-oriented validation.
- Keep `src/` and `tests/` mirrored; place user documentation in `docs/`, normative behavior in `specs/`, and runnable examples in `examples/`.
- Update `RELEASE_NOTES.md` for user-visible changes and `known_drifts.md` for approved exceptions.
- Do not commit secrets, credentials, environment files, or runtime state.
- Do not publish, tag, push, or release without explicit authorization.

The desired architecture and specification inventory are recorded in
`desired_state.md` and `specs/`. These instructions apply to the whole
repository; there are no subtree-specific instruction files.
