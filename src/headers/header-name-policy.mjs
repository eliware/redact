import { DEFAULT_HEADER_NAMES } from "./default-header-names.mjs";

const DEFAULT_SENSITIVE_HEADER_NAMES = new Set(DEFAULT_HEADER_NAMES);

export function isSensitiveHeaderName(name, options = {}) {
  // `normalizedHeaderNames` is the configured additive set, including
  // defaults; matchHeuristics only controls the heuristic fallback.
  const names = options.normalizedHeaderNames ?? DEFAULT_SENSITIVE_HEADER_NAMES;
  return (
    names.has(String(name).toLowerCase()) ||
    (options.matchHeuristics !== false && /token|secret|password|api[-_]?key/i.test(String(name)))
  );
}
