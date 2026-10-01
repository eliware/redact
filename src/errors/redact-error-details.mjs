import { redactValue } from "../structured/redact-value.mjs";
import { readSafeErrorField } from "./read-safe-error-field.mjs";

export function redactErrorDetails(error, options = {}) {
  const details = readSafeErrorField(error, "details");
  return details === undefined ? undefined : redactValue(details, options);
}
