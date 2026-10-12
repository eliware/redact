import { inspectEntries } from "../inspection/safe-entries.mjs";
import { inspectErrorFields } from "../inspection/inspect-error-fields.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";

export function redactError(error, policy, redactChild, maxKeys = Infinity) {
  const inspected = inspectEntries(error, maxKeys);
  // codescope ignore this because the contract returns {} when a retained Error field read fails.
  if (inspected.failed) return {};
  const output = {};
  let fields;
  try {
    fields = inspectErrorFields(error, inspected.entries, inspected.keys);
  } catch {
    return {};
  }
  // codescope ignore this because maxKeys counts enumerable fields; normal Error fields stay non-enumerable.
  // codescope ignore this because inspectErrorFields skips enumerable standard fields omitted by maxKeys.
  for (const [key, value] of fields) {
    Object.defineProperty(output, key, {
      // codescope ignore this because standard Error field names are lowercase.
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
