import { redactErrorDetails } from "./redact-error-details.mjs";
import { redactErrorMessage } from "./redact-error-message.mjs";
import { readSafeErrorField } from "./read-safe-error-field.mjs";

export function safeErrorValue(error, options = {}) {
  if (!error) return { message: "" };
  const output = {
    name: readSafeErrorField(error, "name") ?? "Error",
    message: redactErrorMessage(error, options),
  };
  const details = redactErrorDetails(error, options);
  if (details !== undefined) output.details = details;
  return output;
}
