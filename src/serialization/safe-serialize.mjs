import { inspectEntries } from "../inspection/safe-entries.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";
import { normalizeTraversalLimits } from "../limits/normalize-traversal-limits.mjs";
import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { serializeBuffer } from "./serialize-buffer.mjs";
import { serializeError } from "./serialize-error.mjs";
import { serializePrimitive } from "./serialize-primitive.mjs";

export function safeSerialize(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = normalizeTraversalLimits(options);
  return serialize(value, policy, limits, new WeakSet(), 0);
}

function serialize(value, policy, limits, seen, depth) {
  if (value === null || typeof value !== "object")
    return serializePrimitive(value, limits.maxString);
  if (depth > limits.maxDepth) return "[TRUNCATED]";
  if (seen.has(value)) return "[CIRCULAR]";
  seen.add(value);
  try {
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) return serializeBuffer(value);
    if (value instanceof Error)
      return serializeError(value, policy, limits, seen, depth, serialize);
    if (Array.isArray(value)) {
      const length = value.length;
      const retained = Math.min(length, limits.maxArray);
      const items = [];
      items.length = retained;
      for (let index = 0; index < retained; index++)
        if (Object.hasOwn(value, index))
          items[index] = serialize(value[index], policy, limits, seen, depth + 1);
      if (length > retained) items.push("[TRUNCATED]");
      return items;
    }
    const output = {};
    const inspected = inspectEntries(value, limits.maxKeys);
    if (inspected.failed) return {};
    for (const [key, child] of inspected.entries) {
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
  } catch {
    return "[UNSERIALIZABLE]";
  } finally {
    seen.delete(value);
  }
}
