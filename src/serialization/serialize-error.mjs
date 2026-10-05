import { inspectEntries } from "../inspection/safe-entries.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";

export function serializeError(error, policy, limits, seen, depth, serialize) {
  const inspected = inspectEntries(error, limits.maxKeys);
  if (inspected.failed) return {};
  const values = new Map(inspected.entries);
  const enumerableKeys = new Set(inspected.keys);
  const output = {};
  for (const key of ["name", "message", "stack"]) {
    const field = readErrorField(error, key, values, enumerableKeys);
    if (!field.present || (key === "stack" && !field.value)) continue;
    Object.defineProperty(output, key, {
      value: policy.keys.has(key)
        ? policy.marker
        : serialize(field.value, policy, limits, seen, depth + 1),
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
  if (inspected.truncated) addTruncationMarker(output);
  return output;
}

function readErrorField(error, key, values, enumerableKeys) {
  if (enumerableKeys.has(key))
    return values.has(key) ? { present: true, value: values.get(key) } : { present: false };
  return { present: true, value: error[key] };
}
