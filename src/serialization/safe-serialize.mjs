import { DEFAULT_LIMITS } from "../limits/default-limits.mjs";
import { safeEntries } from "../inspection/safe-entries.mjs";
import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { serializeBuffer } from "./serialize-buffer.mjs";
import { serializeError } from "./serialize-error.mjs";
import { serializePrimitive } from "./serialize-primitive.mjs";

export function safeSerialize(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = { ...DEFAULT_LIMITS, ...options };
  return serialize(value, policy, limits, new WeakSet(), 0);
}

function serialize(value, policy, limits, seen, depth) {
  if (value === null || typeof value !== "object")
    return serializePrimitive(value, limits.maxString);
  if (depth > limits.maxDepth) return "[TRUNCATED]";
  if (seen.has(value)) return "[CIRCULAR]";
  seen.add(value);
  try {
    if (Buffer?.isBuffer?.(value)) return serializeBuffer(value);
    if (value instanceof Error)
      return serializeError(value, policy, limits, seen, depth, serialize);
    if (Array.isArray(value))
      return value
        .slice(0, limits.maxArray)
        .map((item) => serialize(item, policy, limits, seen, depth + 1));
    const output = {};
    for (const [index, [key, child]] of safeEntries(value).entries()) {
      if (index >= limits.maxKeys) {
        output.__truncated = "[TRUNCATED]";
        break;
      }
      output[key] = policy.keys.has(key.toLowerCase())
        ? policy.marker
        : serialize(child, policy, limits, seen, depth + 1);
    }
    return output;
  } catch {
    return "[UNSERIALIZABLE]";
  } finally {
    seen.delete(value);
  }
}
