import { applyTextRules } from './apply-text-rules.mjs';
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
  let output = applyTextRules(value, rules);
  for (const secret of options.secrets ?? []) output = replaceLiteralSecret(output, secret, options.marker ?? '[REDACTED]');
  return output;
}
