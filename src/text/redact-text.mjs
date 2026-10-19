import { applyConfiguredTextRedactions } from "./apply/configured-text-redactions.mjs";
import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { redactAuthorization } from "./rules/redact/authorization.mjs";
import { redactJwt } from "./rules/redact/jwt.mjs";
import { redactKeyMaterial } from "./rules/redact/key/material.mjs";
import { redactKeyValues } from "./rules/redact/key/values.mjs";
import { redactProviderToken } from "./rules/redact/provider-token.mjs";

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
  return applyConfiguredTextRedactions(output, options, policy);
}
