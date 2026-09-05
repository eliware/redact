import { applyTextRules } from './apply-text-rules.mjs';
import { DEFAULT_LIMITS } from '../limits/default-limits.mjs';
import { normalizeSerializationLimits } from '../serialization/serialization-limits.mjs';
import { replaceLiteralSecret } from './replace-literal-secret.mjs';
import { redactAuthorizationRule } from './rules/redact-authorization.mjs';
import { redactBearerTokenRule } from './rules/redact-bearer-token.mjs';
import { redactJwtRule } from './rules/redact-jwt.mjs';
import { redactNamedAssignmentRule } from './rules/redact-named-assignment.mjs';
import { redactPrivateKeyRule } from './rules/redact-private-key.mjs';
import { redactProviderTokenRule } from './rules/redact-provider-token.mjs';
import { redactQuerySecretRule } from './rules/redact-query-secret.mjs';

const rules = [redactPrivateKeyRule, redactAuthorizationRule, redactBearerTokenRule, redactQuerySecretRule, redactNamedAssignmentRule, redactProviderTokenRule, redactJwtRule];

export function redactText(value, options = {}) {
  const { maxString } = normalizeSerializationLimits(options, DEFAULT_LIMITS);
  const input = String(value ?? '');
  const inputTruncated = input.length > maxString;
  let output = input.slice(0, maxString);
  const secrets = [...(options.secrets ?? [])].slice(0, 100);
  for (const secret of secrets) {
    if (typeof secret === 'string' && secret.length > 0) output = replaceLiteralSecret(output, secret, options.marker ?? '[REDACTED]');
  }
  output = applyTextRules(output, rules, options.marker ?? '[REDACTED]');
  if (inputTruncated || output.length > maxString) {
    const marker = '[TRUNCATED]';
    output = maxString >= marker.length
      ? `${output.slice(0, maxString - marker.length)}${marker}`
      : output.slice(0, maxString);
  }
  return output;
}
