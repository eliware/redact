import { replaceLiteralSecret } from "./replace-literal-secret.mjs";
import { redactAuthorization } from "./rules/redact-authorization.mjs";
import { redactJwt } from "./rules/redact-jwt.mjs";
import { redactKeyMaterial } from "./rules/redact-key-material.mjs";
import { redactKeyValues } from "./rules/redact-key-values.mjs";
import { redactProviderToken } from "./rules/redact-provider-token.mjs";

const builtInRules = [
  redactKeyMaterial,
  redactAuthorization,
  redactKeyValues,
  redactProviderToken,
  redactJwt,
];

export function redactText(value, options = {}) {
  let output = String(value ?? "");
  for (const rule of builtInRules) output = rule(output);
  for (const secret of options.secrets ?? [])
    output = replaceLiteralSecret(output, secret, options.marker ?? "[REDACTED]");
  return output;
}
