# Out of Scope

This package does not provide:

- HTML sanitization;
- SQL identifier or query sanitization;
- filesystem path sanitization;
- general input validation;
- encryption or secret storage;
- secret scanning or leak-prevention guarantees;
- authentication, authorization, or access control;
- data-loss-prevention policy enforcement;
- memory, AddressSanitizer, or compiler sanitizer functionality.

CodeScope or other static review tools may report already-documented boundary
semantics as observations. In particular, path-local cycle tracking and
depth-truncated Error metadata are intentional contracts covered by the
serialization specification and tests; they are not defects unless the
implementation contradicts those contracts.
Header redaction does not preserve the representation of every possible
iterable. Its supported representation contract is limited to plain objects,
`Headers`-style `entries()` objects, and entry arrays; treating arbitrary
iterables as a required API would be a false-positive review finding.
The desired-state inventory is descriptive, not a requirement to implement
unreleased speculative text rules. Review findings must compare it with the
current documented release scope rather than treating absent future modules as
defects.

# Out of scope

- `normalizeHeaderNames` is an internal additive-normalization helper, not a
  public exact-match policy API; `redactHeaders` applies `matchHeuristics` at
  the public boundary.
- Text redaction intentionally processes at most 100 configured literal
  secrets and uses bounded repeated replacement for predictable behavior.
- Node.js `Buffer` handling is intentionally not browser-portable; browser
  compatibility is outside this package's supported runtime contract.
- Runtime marker fields are fixed implementation state and are not configurable
  policy options; public declarations intentionally expose only stable options.
