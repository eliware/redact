import { redactProperty } from "./redact-property.mjs";

export function redactErrorStandardFields(fields, policy, redactChild) {
  const output = {
    name: redactProperty("name", fields.name, policy, redactChild),
    message: redactProperty("message", fields.message, policy, redactChild),
  };
  if (fields.stack) output.stack = redactProperty("stack", fields.stack, policy, redactChild);
  return output;
}
