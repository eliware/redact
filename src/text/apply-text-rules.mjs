export function applyTextRules(value, rules) {
  return rules.reduce((output, [pattern, replacement]) => output.replace(pattern, replacement), String(value ?? ''));
}
