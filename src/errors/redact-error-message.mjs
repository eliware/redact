import { redactText } from "../text/redact-text.mjs";
import { readSafeErrorField } from "./read-safe-error-field.mjs";

export function redactErrorMessage(error, options = {}) {
  const message = readSafeErrorField(error, "message");
  if (message != null) return redactText(message, options);
  try {
    return redactText(String(error ?? ""), options);
  } catch {
    return "";
  }
}
