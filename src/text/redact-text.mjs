import { applyTextRules } from './apply-text-rules.mjs';
import { replaceLiteralSecret } from './replace-literal-secret.mjs';
import { SECRET_KEY_PATTERN } from './patterns/secret-key-patterns.mjs';

const rules = [
  [/-----BEGIN [^-]+-----[\s\S]*?-----END [^-]+-----/gu, '[REDACTED]'],
  [/(authorization\s*:\s*(?:bearer\s+)?)[^\s,]+/giu, '$1[REDACTED]'],
  [/(\bBearer\s+)[A-Za-z0-9._~+/=-]+/giu, '$1[REDACTED]'],
  [new RegExp(`([?&]${SECRET_KEY_PATTERN}=)[^&#\\s]+`, 'giu'), '$1[REDACTED]'],
  [new RegExp(`((?:${SECRET_KEY_PATTERN})\\s*[=:]\\s*)(?:"[^"]*"|'[^']*'|[^\\s,};&]+)`, 'giu'), '$1[REDACTED]'],
  [/\b(?:ghp|gho|ghs|github_pat|npm_|pypi-)[A-Za-z0-9_-]+/gu, '[REDACTED]'],
  [/\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/gu, '[REDACTED]'],
];

export function redactText(value, options = {}) {
  let output = applyTextRules(value, rules);
  for (const secret of options.secrets ?? []) output = replaceLiteralSecret(output, secret, options.marker ?? '[REDACTED]');
  return output;
}
