import { copyPropertyDescriptor } from './copy-property-descriptor.mjs';
import { readObjectEntries } from './object-entry-reader.mjs';
import { redactProperty } from './redact-property.mjs';

export function redactObject(value, policy, redactChild) {
  const output = Object.create(null);
  for (const [key, child] of readObjectEntries(value)) copyPropertyDescriptor(output, key, redactProperty(key, child, policy, redactChild));
  return output;
}
