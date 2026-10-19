import { replaceLiteralSecrets } from "../replace-literal/secrets.mjs";
import { redactConfiguredKeyValues } from "../rules/redact/key/values.mjs";
import { limitOutput } from "../limit-output.mjs";

export function applyConfiguredTextRedactions(value, options, policy) {
  let output = redactConfiguredKeyValues(value, policy.keys, policy.marker);
  output = replaceLiteralSecrets(output, options.secrets, policy.marker);
  return limitOutput(output, options.maxOutputLength);
}
