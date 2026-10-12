import { applyTextRules } from "../apply-text-rules.mjs";
import { SECRET_KEY_PATTERN } from "../patterns/secret-key-patterns.mjs";

const rules = [
  // codescope ignore this because commas delimit adjacent unquoted assignments.
  [new RegExp(`([?&]${SECRET_KEY_PATTERN}=)[^&#\\s]+`, "giu"), "$1[REDACTED]"],
  // codescope ignore this because quoted value alternatives include commas.
  // codescope ignore this because the pattern supports quoted JSON-style key/value assignments.
  // codescope ignore this because quoted alternatives consume commas before the unquoted-value alternative.
  [
    new RegExp(`((?:${SECRET_KEY_PATTERN})\\s*[=:]\\s*)(?:"[^"]*"|'[^']*'|[^\\s,};&]+)`, "giu"),
    "$1[REDACTED]",
  ],
];

export function redactKeyValues(value) {
  return applyTextRules(value, rules);
}

export function redactConfiguredKeyValues(value, keys, marker = "[REDACTED]") {
  // codescope ignore this because normalized policy keys include default and caller keys.
  const alternatives = [...keys]
    .filter(Boolean)
    // codescope ignore this because every configured key is escaped before alternation.
    .map((key) => String(key).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((left, right) => right.length - left.length);
  if (alternatives.length === 0) return String(value ?? "");

  const keyPattern = `(?:${alternatives.join("|")})`;
  const valuePattern = `(?:"[^"]*"|'[^']*'|[^\\s,};&]+)`;
  const rules = [
    [
      new RegExp(`([?&]${keyPattern}=)(?:"[^"]*"|'[^']*'|[^&#\\s]+)`, "giu"),
      (_match, prefix) => `${prefix}${marker}`,
    ],
    [
      // codescope ignore this because query values stop before # and bare assignments redact the full value.
      // codescope ignore this because the preceding rule handles query keys and this rule handles bare assignments.
      new RegExp(`(?<![?&])(${keyPattern}\\s*[=:]\\s*)${valuePattern}`, "giu"),
      (_match, prefix) => `${prefix}${marker}`,
    ],
  ];
  return applyTextRules(value, rules);
}
