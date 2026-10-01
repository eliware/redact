import { readonlySet } from "../policy/readonly-set.mjs";
import { DEFAULT_HEADER_NAMES } from "./default-header-names.mjs";
import { validateHeaderNames } from "./validate-header-names.mjs";

// Internal additive normalizer; public exact-match behavior is applied by
// redactHeaders after matchHeuristics is considered.
export function normalizeHeaderNames(headerNames) {
  validateHeaderNames(headerNames);
  const names =
    headerNames == null ? DEFAULT_HEADER_NAMES : [...DEFAULT_HEADER_NAMES, ...headerNames];
  return readonlySet(new Set(names.map((value) => String(value).toLowerCase())));
}
