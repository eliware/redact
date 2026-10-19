import { addTruncationMarker } from "../../inspection/add-truncation-marker.mjs";
import { inspectEntries } from "../../inspection/safe-entries.mjs";

export function redactObject(value, policy, limits, redactChild) {
  const output = {};
  const inspected = inspectEntries(value, limits.maxKeys);
  if (inspected.failed) return {};

  for (const [key, child] of inspected.entries) {
    const redactedChild = policy.keys.has(key.toLowerCase()) ? policy.marker : redactChild(child);
    Object.defineProperty(output, key, {
      value: redactedChild,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }

  if (inspected.truncated) addTruncationMarker(output);
  return output;
}
