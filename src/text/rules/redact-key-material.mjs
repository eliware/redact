import { applyTextRules } from "../apply-text-rules.mjs";

const rules = [[/-----BEGIN [^-]+-----[\s\S]*?-----END [^-]+-----/gu, "[REDACTED]"]];

export function redactKeyMaterial(value) {
  return applyTextRules(value, rules);
}
