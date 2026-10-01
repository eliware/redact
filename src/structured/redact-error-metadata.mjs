import { readObjectEntries } from "./object-entry-reader.mjs";
import { redactProperty } from "./redact-property.mjs";

const standardFields = new Set(["name", "message", "stack"]);

export function redactErrorMetadata(value, policy, redactChild) {
  return readObjectEntries(value, Number.POSITIVE_INFINITY, standardFields).map(([key, child]) => [
    key,
    redactProperty(key, child, policy, redactChild),
  ]);
}
