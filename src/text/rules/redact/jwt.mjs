import { applyTextRules } from "../../apply/text-rules.mjs";
import { JWT_PATTERN } from "./jwt/pattern.mjs";

const rules = [[JWT_PATTERN, "[REDACTED]"]];

export function redactJwt(value) {
  return applyTextRules(value, rules);
}
