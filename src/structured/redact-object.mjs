import { copyPropertyDescriptor } from './copy-property-descriptor.mjs';
import { readObjectEntries } from './object-entry-reader.mjs';
import { redactProperty } from './redact-property.mjs';

export function redactObject(value, policy, redactChild) {
  const output = Object.create(null);
  const limit = policy.maxKeys ?? Number.POSITIVE_INFINITY;
  const entries = readObjectEntries(value, limit + 1);
  for (const [index, [key, child]] of entries.entries()) {
    if (index >= limit) { addTruncationMarker(output); break; }
    copyPropertyDescriptor(output, key, redactProperty(key, child, policy, redactChild));
  }
  return output;
}

function addTruncationMarker(output) {
  let key = '__truncated';
  while (Object.hasOwn(output, key)) key = `_${key}`;
  output[key] = '[TRUNCATED]';
}
