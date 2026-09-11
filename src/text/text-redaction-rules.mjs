import { applyTextRules } from "./apply-text-rules.mjs";
import { redactAuthorizationRule } from "./rules/redact-authorization.mjs";
import { redactBearerTokenRule } from "./rules/redact-bearer-token.mjs";
import { redactJwtRule } from "./rules/redact-jwt.mjs";
import { redactNamedAssignmentRule } from "./rules/redact-named-assignment.mjs";
import { redactPrivateKeyRule } from "./rules/redact-private-key.mjs";
import { redactProviderTokenRule } from "./rules/redact-provider-token.mjs";
import { redactQuerySecretRule } from "./rules/redact-query-secret.mjs";
import {
  redactGenericSecretRule,
  redactOpaqueBase64Rule,
  redactOpaqueSecretRule,
  redactProviderKeyRule,
  redactPublicKeyRule,
} from "./rules/redact-generic-secret-rule.mjs";
const rules = [
  redactPrivateKeyRule,
  redactAuthorizationRule,
  redactBearerTokenRule,
  redactQuerySecretRule,
  redactNamedAssignmentRule,
  redactGenericSecretRule,
  redactProviderTokenRule,
  redactProviderKeyRule,
  redactPublicKeyRule,
  redactOpaqueSecretRule,
  redactOpaqueBase64Rule,
  redactJwtRule,
];
export function applyTextRedactionRules(value) {
  return applyTextRules(value, rules);
}
