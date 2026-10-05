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

export function redactConfiguredKeyValues(value, keys, marker = "[REDACTED]") {
  const alternatives = [...keys]
    .filter(Boolean)
    .map((key) => String(key).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (alternatives.length === 0) return String(value ?? "");

  const keyPattern = `(?:${alternatives.join("|")})`;
  const valuePattern = `(?:"[^"]*"|'[^']*'|[^\\s,};&]+)`;
  const rules = [
    [new RegExp(`([?&]${keyPattern}=)(?:"[^"]*"|'[^']*'|[^&#\\s]+)`, "giu"), `$1${marker}`],
    [new RegExp(`(${keyPattern}\\s*[=:]\\s*)${valuePattern}`, "giu"), `$1${marker}`],
  ];
  return applyTextRules(value, rules);
}
