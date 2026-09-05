import { readSafeEntries } from '../inspection/read-safe-entries.mjs';

export function serializeError(error, policy, serialize, depth) {
  const output = {
    name: serialize(error.name, depth),
    message: policy.keys.has('message') ? policy.marker : serialize(error.message, depth),
  };
  if (error.stack) output.stack = serialize(error.stack, depth);
  for (const [key, child] of readSafeEntries(error)) {
    if (!(key in output)) output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : serialize(child, depth + 1);
  }
  return output;
}
