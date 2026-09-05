# Documentation

`@eliware/redact` is a reusable boundary-safety library for protecting values
before logging, persistence, or transport. Install it with `npm install
@eliware/redact`, then use the public functions from the package entrypoint.

Configuration is supplied as API options such as `keys`, `marker`,
`circularMarker`, header policy options, and serialization limits. Do not put
credentials in source, examples, `.env.example`, or documentation. Redaction
is best-effort and is not encryption or a guarantee that unknown secrets are
detected.

For troubleshooting, run `npm test`, `npm run lint`, `npm run typecheck`, and
`npm run pack`. Report reproducible issues through the GitHub issue tracker.

- [Specifications](../specs/README.md)
- [Release notes](../RELEASE_NOTES.md)
- [Examples](../examples/README.md)
