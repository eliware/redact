import { inspectEntries } from "../inspection/safe-entries.mjs";
import { inspectErrorFields } from "../inspection/inspect-error-fields.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";

export function serializeError(error, policy, limits, seen, depth, serialize) {
  const inspected = inspectEntries(error, limits.maxKeys);
  if (inspected.failed) return {};
  const output = {};
  const errorFields = inspectErrorFields(error, inspected.entries, inspected.keys, limits.maxKeys);
  for (const [key, value] of errorFields.fields) {
    Object.defineProperty(output, key, {
      value: policy.keys.has(key.toLowerCase())
        ? policy.marker
        : serialize(value, policy, limits, seen, depth + 1),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
  for (const [key, child] of inspected.entries) {
    if (["name", "message", "stack"].includes(key)) continue;
    Object.defineProperty(output, key, {
      value: policy.keys.has(key.toLowerCase())
        ? policy.marker
        : serialize(child, policy, limits, seen, depth + 1),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
  if (inspected.truncated || errorFields.truncated) addTruncationMarker(output);
  return output;
}
