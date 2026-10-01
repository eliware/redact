export const redactGenericAssignmentRule = [
  /((?:[A-Z][A-Z0-9_]{2,})\s*[=:]\s*)(?:"[^"]*"|'[^']*'|[^\s,};&]+)/gu,
  "$1[REDACTED]",
];
