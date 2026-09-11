import { applyTextRules } from "./apply-text-rules.mjs";
import { DEFAULT_LIMITS } from "../limits/default-limits.mjs";
import { normalizeSerializationLimits } from "../serialization/serialization-limits.mjs";
import { replaceLiteralSecret } from "./replace-literal-secret.mjs";
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

export function redactText(value, options = {}) {
  const { maxString } = normalizeSerializationLimits(options, DEFAULT_LIMITS);
  const input = String(value ?? "");
  const inputTruncated = input.length > maxString;
  let output = input;
  const configuredSecrets = options.secrets;
  if (
    configuredSecrets != null &&
    (typeof configuredSecrets === "string" ||
      typeof configuredSecrets[Symbol.iterator] !== "function")
  )
    throw new TypeError("secrets must be iterable");
  const secrets = [];
  if (configuredSecrets != null) {
    for (const secret of configuredSecrets) {
      if (typeof secret === "string" && secret.length > 0) secrets.push(secret);
      if (secrets.length === 100) break;
    }
  }
  for (const secret of secrets) {
    output = replaceLiteralSecret(output, secret);
  }
  output = applyTextRules(output, rules);
  if (inputTruncated || output.length > maxString) {
    const marker = "[TRUNCATED]";
    output =
      maxString >= marker.length
        ? `${output.slice(0, maxString - marker.length)}${marker}`
        : output.slice(0, maxString);
  }
  return output;
}
