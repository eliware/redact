import { inspectEntries } from "../inspection/safe-entries.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";

export function serializeError(error, policy, limits, seen, depth, serialize) {
  const output = {
    name: policy.keys.has("name")
      ? policy.marker
      : serialize(error.name, policy, limits, seen, depth),
    message: policy.keys.has("message")
      ? policy.marker
      : serialize(error.message, policy, limits, seen, depth),
  };
  if (error.stack)
    output.stack = policy.keys.has("stack")
      ? policy.marker
      : serialize(error.stack, policy, limits, seen, depth);
  const inspected = inspectEntries(error, limits.maxKeys, (key) => !Object.hasOwn(output, key));
  if (inspected.failed) return {};
  for (const [key, child] of inspected.entries)
    Object.defineProperty(output, key, {
      value: policy.keys.has(key.toLowerCase())
        ? policy.marker
        : serialize(child, policy, limits, seen, depth + 1),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  if (inspected.truncated) addTruncationMarker(output);
  return output;
}
