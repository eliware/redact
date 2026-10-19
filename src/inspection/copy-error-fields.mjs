import { addTruncationMarker } from "./add-truncation-marker.mjs";
import { inspectErrorFields } from "./inspect-error-fields.mjs";
import { inspectEntries } from "./safe-entries.mjs";

export function copyErrorFields(error, maxKeys, mapValue) {
  const inspected = inspectEntries(error, maxKeys);
  if (inspected.failed) return {};

  const fields = inspectErrorFields(error, inspected.entries, inspected.keys, maxKeys);
  const output = {};
  for (const [key, value] of fields.fields) {
    Object.defineProperty(output, key, {
      value: mapValue(key, value),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
  for (const [key, value] of inspected.entries) {
    if (["name", "message", "stack"].includes(key)) continue;
    Object.defineProperty(output, key, {
      value: mapValue(key, value),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
  if (inspected.truncated || fields.truncated) addTruncationMarker(output);
  return output;
}
