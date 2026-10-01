import { isError } from "../inspection/is-error.mjs";
import { redactArray } from "./redact-array.mjs";
import { redactError } from "./redact-error.mjs";
import { redactObject } from "./redact-object.mjs";

export function redactStructuredValue(value, policy, redactChild) {
  if (isError(value)) return redactError(value, policy, redactChild);
  return Array.isArray(value)
    ? redactArray(value, policy, redactChild)
    : redactObject(value, policy, redactChild);
}
