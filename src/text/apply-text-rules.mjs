export function applyTextRules(value, rules, marker = '[REDACTED]') {
  return rules.reduce((output, [pattern, replacement]) => output.replace(pattern, replacement.replaceAll('[REDACTED]', marker)), String(value ?? ''));
}
