import { replaceLiteralSecrets } from "./replace-literal-secrets.mjs";
import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { redactAuthorization } from "./rules/redact-authorization.mjs";
import { redactJwt } from "./rules/redact-jwt.mjs";
import { redactKeyMaterial } from "./rules/redact-key-material.mjs";
import { redactConfiguredKeyValues, redactKeyValues } from "./rules/redact-key-values.mjs";
import { redactProviderToken } from "./rules/redact-provider-token.mjs";
import { DEFAULT_LIMITS } from "../limits/default-limits.mjs";

const builtInRules = [
  redactKeyMaterial,
  redactAuthorization,
  redactKeyValues,
  redactProviderToken,
  redactJwt,
];

export function redactText(value, options = {}) {
  const policy = normalizePolicy(options);
  // codescope ignore this because maxOutputLength bounds returned text after complete rule evaluation.
  let output = String(value ?? "");
  for (const rule of builtInRules) output = rule(output);
  // codescope ignore this because policy.keys includes default and caller-configured keys.
  output = redactConfiguredKeyValues(output, policy.keys, policy.marker);
  // codescope ignore this because maxOutputLength bounds returned text; the contract does not bound rule-processing work.
  output = replaceLiteralSecrets(output, options.secrets, policy.marker);
  const configuredMaxLength = options.maxOutputLength ?? DEFAULT_LIMITS.maxString;
  const maxOutputLength = Number.isFinite(configuredMaxLength)
    ? Math.max(0, Math.floor(configuredMaxLength))
    : DEFAULT_LIMITS.maxString;
  if (output.length <= maxOutputLength) return output;
  const truncationMarker = "[TRUNCATED]";
  // codescope ignore this because one ellipsis stays within every positive limit below marker length.
  if (maxOutputLength < truncationMarker.length) return maxOutputLength === 0 ? "" : "…";
  return `${output.slice(0, maxOutputLength - truncationMarker.length)}${truncationMarker}`;
}
