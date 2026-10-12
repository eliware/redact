import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { inspectEntries } from "../inspection/safe-entries.mjs";
import { redactError } from "./redact-error.mjs";
import { redactArray } from "./redact-array.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";
import { normalizeTraversalLimits } from "../limits/normalize-traversal-limits.mjs";

export function redactValue(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = normalizeTraversalLimits(options);
  return redact(value, policy, limits, new WeakMap(), 0);
}

function redact(value, policy, limits, seen, depth) {
  if (depth > limits.maxDepth) return "[TRUNCATED]";
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return policy.circularMarker ?? "[CIRCULAR]";
  let isArray;
  let isError;
  try {
    isArray = Array.isArray(value);
    isError = value instanceof Error;
  } catch {
    return isArray === true ? [] : {};
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
      return redactArray(value, policy, limits, (child) =>
        redact(child, policy, limits, seen, depth + 1),
      );
    }
    const output = {};
    const inspected = inspectEntries(value, limits.maxKeys);
    if (inspected.failed) return {};
    for (const [key, child] of inspected.entries) {
      const redactedChild = policy.keys.has(key.toLowerCase())
        ? policy.marker
        : redact(child, policy, limits, seen, depth + 1);
      Object.defineProperty(output, key, {
        value: redactedChild,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
    if (inspected.truncated) addTruncationMarker(output);
    return output;
  } finally {
    seen.delete(value);
  }
}
