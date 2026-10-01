import { applyTextRules } from "./apply-text-rules.mjs";
import { TEXT_REDACTION_RULES } from "./text-redaction-rule-set.mjs";

export function applyTextRedactionRules(value) {
  return applyTextRules(value, TEXT_REDACTION_RULES);
}
