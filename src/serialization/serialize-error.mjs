import { safeEntries } from "../inspection/safe-entries.mjs";

export function serializeError(error, policy, limits, seen, depth, serialize) {
  const output = {
    name: serialize(error.name, policy, limits, seen, depth),
    message: policy.keys.has("message")
      ? policy.marker
      : serialize(error.message, policy, limits, seen, depth),
  };
  if (error.stack) output.stack = serialize(error.stack, policy, limits, seen, depth);
  for (const [key, child] of safeEntries(error))
    if (!(key in output))
      output[key] = policy.keys.has(key.toLowerCase())
        ? policy.marker
        : serialize(child, policy, limits, seen, depth + 1);
  return output;
}
