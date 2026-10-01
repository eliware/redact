import { redactText } from "../text/redact-text.mjs";

export function serializeStringValue(value, limits) {
  return redactText(value, {
    maxString: limits.maxString,
    secrets: limits.secrets,
  });
}
