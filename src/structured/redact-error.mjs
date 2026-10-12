import { inspectEntries } from "../inspection/safe-entries.mjs";
import { inspectErrorFields } from "../inspection/inspect-error-fields.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";

export function redactError(error, policy, redactChild, maxKeys = Infinity) {
  const inspected = inspectEntries(error, maxKeys);
  if (inspected.failed) return {};
  const output = {};
  let fields;
  try {
    fields = inspectErrorFields(error, inspected.entries, inspected.keys);
  } catch {
    return {};
  }
  for (const [key, value] of fields) {
    Object.defineProperty(output, key, {
      value: policy.keys.has(key) ? policy.marker : redactChild(value),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
  for (const [key, child] of inspected.entries) {
    if (["name", "message", "stack"].includes(key)) continue;
    Object.defineProperty(output, key, {
      value: policy.keys.has(key.toLowerCase()) ? policy.marker : redactChild(child),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
  if (inspected.truncated) addTruncationMarker(output);
  return output;
}
