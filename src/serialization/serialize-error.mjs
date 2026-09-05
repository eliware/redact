import { readSafeEntries } from '../inspection/read-safe-entries.mjs';

export function serializeError(error, policy, serialize, depth) {
  const output = {
    name: serialize(error.name, depth + 1),
    message: policy.keys.has('message') ? policy.marker : serialize(error.message, depth + 1),
  };
  if (error.stack) output.stack = policy.keys.has('stack') ? policy.marker : serialize(error.stack, depth + 1);
  for (const [key, child] of readSafeEntries(error)) {
    if (!(key in output)) output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : serialize(child, depth + 1);
  }
  return output;
}
