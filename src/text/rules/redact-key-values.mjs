import { applyTextRules } from "../apply-text-rules.mjs";
import { SECRET_KEY_PATTERN } from "../patterns/secret-key-patterns.mjs";

const rules = [
  [new RegExp(`([?&]${SECRET_KEY_PATTERN}=)[^&#\\s]+`, "giu"), "$1[REDACTED]"],
  [
    new RegExp(`((?:${SECRET_KEY_PATTERN})\\s*[=:]\\s*)(?:"[^"]*"|'[^']*'|[^\\s,};&]+)`, "giu"),
    "$1[REDACTED]",
  ],
];

export function redactKeyValues(value) {
  return applyTextRules(value, rules);
}
