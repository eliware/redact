import { DEFAULT_LIMITS } from "../limits/default-limits.mjs";
import { normalizeSerializationLimits } from "../serialization/serialization-limits.mjs";
import { replaceLiteralSecret } from "./replace-literal-secret.mjs";
import { collectLiteralSecrets } from "./collect-literal-secrets.mjs";
import { applyTextRedactionRules } from "./text-redaction-rules.mjs";
import { truncateRedactedText } from "./truncate-redacted-text.mjs";

export function redactText(value, options = {}) {
  const { maxString } = normalizeSerializationLimits(options, DEFAULT_LIMITS);
  const input = String(value ?? "");
  const inputTruncated = input.length > maxString;
  let output = input;
  for (const secret of collectLiteralSecrets(options.secrets)) {
    output = replaceLiteralSecret(output, secret);
  }
  return truncateRedactedText(
    applyTextRedactionRules(output),
    maxString,
    inputTruncated,
  );
}
