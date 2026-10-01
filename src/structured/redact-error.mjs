import { copyPropertyDescriptor } from "./copy-property-descriptor.mjs";
import { readErrorStandardFields } from "./read-error-standard-fields.mjs";
import { redactErrorMetadata } from "./redact-error-metadata.mjs";
import { redactErrorStandardFields } from "./redact-error-standard-fields.mjs";

export function redactError(value, policy, redactChild) {
  const fields = readErrorStandardFields(value);
  const output = redactErrorStandardFields(fields, policy, redactChild);
  for (const [key, child] of redactErrorMetadata(value, policy, redactChild))
    copyPropertyDescriptor(output, key, child);
  return output;
}
