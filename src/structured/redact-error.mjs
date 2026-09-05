import { readObjectEntries } from './object-entry-reader.mjs';
import { redactProperty } from './redact-property.mjs';

export function redactError(value, policy, redactChild) {
  const read = key => { try { return value[key]; } catch { return undefined; } };
  const output = {
    name: redactProperty('name', read('name'), policy, redactChild),
    message: redactProperty('message', read('message'), policy, redactChild),
  };
  const stack = read('stack');
  if (stack) output.stack = redactProperty('stack', stack, policy, redactChild);
  for (const [key, child] of readObjectEntries(value)) {
    if (!(key in output)) output[key] = redactProperty(key, child, policy, redactChild);
  }
  return output;
}
