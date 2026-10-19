import { normalizePolicy } from "../../policy/normalize-policy.mjs";
import { redactError } from "./error.mjs";
import { redactArray } from "./array.mjs";
import { redactObject } from "./object.mjs";
import { normalizeTraversalLimits } from "../../limits/normalize-traversal-limits.mjs";

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
    return redactObject(value, policy, limits, (child) =>
      redact(child, policy, limits, seen, depth + 1),
    );
  } finally {
    seen.delete(value);
  }
}
