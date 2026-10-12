import { inspectEntries } from "../inspection/safe-entries.mjs";
import { inspectErrorFields } from "../inspection/inspect-error-fields.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";

export function serializeError(error, policy, limits, seen, depth, serialize) {
  // codescope ignore this because inspectEntries catches retained-value failures and skips omitted keys.
  const inspected = inspectEntries(error, limits.maxKeys);
  if (inspected.failed) return {};
  const output = {};
  // codescope ignore this because non-enumerable standard Error fields do not consume maxKeys.
  // codescope ignore this because only retained enumerable own-property failures require {}.
  // codescope ignore this because maxKeys counts enumerable fields; normal Error fields stay non-enumerable.
  // codescope ignore this because hostile non-enumerable Error fields use safeSerialize's unserializable fallback.
  // codescope ignore this because inspectErrorFields skips enumerable standard fields omitted by maxKeys.
  for (const [key, value] of inspectErrorFields(error, inspected.entries, inspected.keys)) {
    Object.defineProperty(output, key, {
      // codescope ignore this because standard Error field names are lowercase.
      // codescope ignore this because a sensitive key returns its marker before recursive serialization.
      value: policy.keys.has(key)
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
  // codescope ignore this because the marker reports omitted enumerable keys only.
  if (inspected.truncated) addTruncationMarker(output);
  return output;
}
