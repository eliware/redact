import { applyConfiguredTextRedactions } from "./apply/configured-text-redactions.mjs";
import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { redactAuthorization } from "./rules/redact/authorization.mjs";
import { redactJwt } from "./rules/redact/jwt.mjs";
import { redactKeyMaterial } from "./rules/redact/key/material.mjs";
import { redactKeyValues } from "./rules/redact/key/values.mjs";
import { redactProviderToken } from "./rules/redact/provider-token.mjs";
import { limitOutput } from "./limit-output.mjs";
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
  const input = String(value ?? "");
  const configuredLength = options.maxOutputLength ?? DEFAULT_LIMITS.maxString;
  const maxLength = Number.isFinite(configuredLength)
    ? Math.max(0, Math.floor(configuredLength))
    : DEFAULT_LIMITS.maxString;
  const inputTruncated = input.length > maxLength;
  const secrets =
    typeof options.secrets === "string"
      ? [options.secrets]
      : [...(options.secrets ?? [])].map(String);
  const lookahead = Math.max(0, ...secrets.map((secret) => secret.length - 1));
  const processingLimit = maxLength + lookahead;
  let output = inputTruncated ? input.slice(0, processingLimit) : input;
  for (const rule of builtInRules) output = rule(output);
  output = applyConfiguredTextRedactions(
    output,
    { ...options, secrets, maxOutputLength: processingLimit },
    policy,
  );
  return limitOutput(inputTruncated ? `${output}[TRUNCATED]` : output, options.maxOutputLength);
}
