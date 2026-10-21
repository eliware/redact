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

const boundedJwtPattern = /\beyJ[A-Za-z0-9_-]{5,}(?:\.[A-Za-z0-9_-]*){0,2}/gu;
const boundedJwtMarker = "\u0000bounded-jwt-redacted\u0000";

function redactJwtAtBoundary(value, boundary) {
  let redacted = false;
  const output = value.replace(boundedJwtPattern, (match, offset) => {
    if (offset >= boundary || offset + match.length < boundary) return match;
    redacted = true;
    return boundedJwtMarker;
  });
  return { output, redacted };
}

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
  const lookahead = Math.max(0, ...secrets.map((secret) => secret.length));
  const processingLimit = maxLength + lookahead;
  const boundaryResult = inputTruncated
    ? redactJwtAtBoundary(input.slice(0, processingLimit), maxLength)
    : { output: input, redacted: false };
  let output = boundaryResult.output;
  for (const rule of builtInRules) output = rule(output);
  output = applyConfiguredTextRedactions(
    output,
    { ...options, secrets, maxOutputLength: processingLimit },
    policy,
  );
  if (boundaryResult.redacted) {
    const marker = "[REDACTED][TRUNCATED]";
    const prefix = output.slice(0, output.indexOf(boundedJwtMarker));
    return `${prefix.slice(0, Math.max(0, maxLength - marker.length))}${marker}`;
  }
  return limitOutput(inputTruncated ? `${output}[TRUNCATED]` : output, options.maxOutputLength);
}
