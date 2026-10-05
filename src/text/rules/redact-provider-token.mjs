import { applyTextRules } from "../apply-text-rules.mjs";

const rules = [[/\b(?:ghp|gho|ghs|github_pat|npm_|pypi-)[A-Za-z0-9_-]+/gu, "[REDACTED]"]];

export function redactProviderToken(value) {
  return applyTextRules(value, rules);
}
