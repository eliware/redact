import { applyTextRules } from "../apply-text-rules.mjs";

const rules = [[/\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/gu, "[REDACTED]"]];

export function redactJwt(value) {
  return applyTextRules(value, rules);
}
