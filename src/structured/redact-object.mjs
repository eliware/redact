import { copyPropertyDescriptor } from "./copy-property-descriptor.mjs";
import { readBoundedObjectEntries } from "./read-bounded-object-entries.mjs";
import { redactProperty } from "./redact-property.mjs";
import { appendTruncationMarker } from "../limits/append-truncation-marker.mjs";

export function redactObject(value, policy, redactChild) {
  const output = Object.create(null);
  const limit = policy.maxKeys ?? Number.POSITIVE_INFINITY;
  const selection = readBoundedObjectEntries(value, limit);
  for (const [key, child] of selection.entries)
    copyPropertyDescriptor(output, key, redactProperty(key, child, policy, redactChild));
  if (selection.truncated) appendTruncationMarker(output);
  return output;
}
