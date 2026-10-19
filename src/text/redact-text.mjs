import { replaceLiteralSecrets } from "./replace-literal/secrets.mjs";
import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { redactAuthorization } from "./rules/redact/authorization.mjs";
import { redactJwt } from "./rules/redact/jwt.mjs";
import { redactKeyMaterial } from "./rules/redact/key/material.mjs";
import { redactConfiguredKeyValues, redactKeyValues } from "./rules/redact/key/values.mjs";
import { redactProviderToken } from "./rules/redact/provider-token.mjs";
import { limitOutput } from "./limit-output.mjs";

const builtInRules = [
  redactKeyMaterial,
  redactAuthorization,
  redactKeyValues,
  redactProviderToken,
  redactJwt,
];

export function redactText(value, options = {}) {
  const policy = normalizePolicy(options);
  let output = String(value ?? "");
  for (const rule of builtInRules) output = rule(output);
  output = redactConfiguredKeyValues(output, policy.keys, policy.marker);
  output = replaceLiteralSecrets(output, options.secrets, policy.marker);
  return limitOutput(output, options.maxOutputLength);
}
