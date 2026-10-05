import { applyTextRules } from "../apply-text-rules.mjs";

const rules = [
  [/(authorization\s*:\s*(?:bearer\s+)?)[^\s,]+/giu, "$1[REDACTED]"],
  [/(\bBearer\s+)[A-Za-z0-9._~+/=-]+/giu, "$1[REDACTED]"],
];

export function redactAuthorization(value) {
  return applyTextRules(value, rules);
}
