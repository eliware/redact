import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { inspectEntries } from "../inspection/safe-entries.mjs";
import { redactError } from "./redact-error.mjs";
import { DEFAULT_LIMITS } from "../limits/default-limits.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";

export function redactValue(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = { ...DEFAULT_LIMITS, ...options };
  return redact(value, policy, limits, new WeakMap(), 0);
}

function redact(value, policy, limits, seen, depth) {
  if (value === null || typeof value !== "object") return value;
  if (depth > limits.maxDepth) return "[TRUNCATED]";
  if (seen.has(value)) return policy.circularMarker ?? "[CIRCULAR]";
  let isArray;
  let isError;
  try {
    isArray = Array.isArray(value);
    isError = value instanceof Error;
  } catch {
    return isArray ? [] : {};
  }
  if (isError) {
    seen.set(value, true);
    try {
      return redactError(
        value,
        policy,
        (child) => redact(child, policy, limits, seen, depth + 1),
        limits.maxKeys,
      );
    } finally {
      seen.delete(value);
    }
  }
  seen.set(value, true);
  try {
    if (isArray) {
      try {
        const length = value.length;
        const retained = Math.min(length, limits.maxArray);
        const items = [];
        for (let index = 0; index < retained; index++)
          items.push(redact(value[index], policy, limits, seen, depth + 1));
        if (length > retained) items.push("[TRUNCATED]");
        return items;
      } catch {
        return [];
      }
    }
    const output = {};
    const inspected = inspectEntries(value, limits.maxKeys);
    if (inspected.failed) return {};
    for (const [key, child] of inspected.entries)
      Object.defineProperty(output, key, {
        value: policy.keys.has(key.toLowerCase())
          ? policy.marker
          : redact(child, policy, limits, seen, depth + 1),
        enumerable: true,
        configurable: true,
        writable: true,
      });
    if (inspected.truncated) addTruncationMarker(output);
    return output;
  } finally {
    seen.delete(value);
  }
}
