import { redactAuthorizationRule } from "./rules/redact-authorization.mjs";
import { redactBearerTokenRule } from "./rules/redact-bearer-token.mjs";
import { redactJwtRule } from "./rules/redact-jwt.mjs";
import { redactNamedAssignmentRule } from "./rules/redact-named-assignment.mjs";
import { redactPrivateKeyRule } from "./rules/redact-private-key.mjs";
import { redactProviderTokenRule } from "./rules/redact-provider-token.mjs";
import { redactQuerySecretRule } from "./rules/redact-query-secret.mjs";
import { redactGenericAssignmentRule } from "./rules/redact-generic-assignment.mjs";
import { redactOpaqueBase64Rule } from "./rules/redact-opaque-base64.mjs";
import { redactOpaqueSecretRule } from "./rules/redact-opaque-secret.mjs";
import { redactProviderKeyRule } from "./rules/redact-provider-key.mjs";
import { redactPublicKeyRule } from "./rules/redact-public-key.mjs";

export const TEXT_REDACTION_RULES = Object.freeze([
  redactPrivateKeyRule,
  redactAuthorizationRule,
  redactBearerTokenRule,
  redactQuerySecretRule,
  redactNamedAssignmentRule,
  redactGenericAssignmentRule,
  redactProviderTokenRule,
  redactProviderKeyRule,
  redactPublicKeyRule,
  redactOpaqueSecretRule,
  redactOpaqueBase64Rule,
  redactJwtRule,
]);
