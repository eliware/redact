import { readObjectEntries } from './object-entry-reader.mjs';
import { redactProperty } from './redact-property.mjs';

export function redactError(value, policy, redactChild) {
  const output = { name: value.name, message: value.message };
  if (value.stack) output.stack = value.stack;
  for (const [key, child] of readObjectEntries(value)) {
    if (!(key in output)) output[key] = redactProperty(key, child, policy, redactChild);
  }
  return output;
}
