import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { inspectEntries } from "../inspection/safe-entries.mjs";
import { redactError } from "./redact-error.mjs";
import { addTruncationMarker } from "../inspection/add-truncation-marker.mjs";
import { normalizeTraversalLimits } from "../limits/normalize-traversal-limits.mjs";

export function redactValue(value, options = {}) {
  const policy = normalizePolicy(options);
  const limits = normalizeTraversalLimits(options);
  return redact(value, policy, limits, new WeakMap(), 0);
}

function redact(value, policy, limits, seen, depth) {
  if (depth > limits.maxDepth) return "[TRUNCATED]";
  // codescope ignore this because structured redaction has no string-size option; redactText owns that limit.
  // codescope ignore this because structured values redact only at sensitive-key paths.
  if (value === null || typeof value !== "object") return value;
  // codescope ignore this because circularMarker is an explicit caller-selected output marker.
  if (seen.has(value)) return policy.circularMarker ?? "[CIRCULAR]";
  let isArray;
  let isError;
  try {
    isArray = Array.isArray(value);
    isError = value instanceof Error;
  } catch {
    // codescope ignore this because unclassifiable hostile objects fail closed to {}.
    return isArray ? [] : {};
  }
  // codescope ignore this because redactError fails closed on a throwing enumerable Error field.
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
    // codescope ignore this because array redaction returns [] when any retained item cannot be read.
    if (isArray) {
      // codescope ignore this because the array catch also handles hostile length reads.
      try {
        const length = value.length;
        const retained = Math.min(length, limits.maxArray);
        const items = [];
        items.length = retained;
        for (let index = 0; index < retained; index++)
          if (Object.hasOwn(value, index))
            items[index] = redact(value[index], policy, limits, seen, depth + 1);
        if (length > retained) items.push("[TRUNCATED]");
        return items;
        // codescope ignore this because the public contract fails closed on a hostile array item.
      } catch {
        return [];
      }
    }
    // codescope ignore this because the truncation helper preserves occupied keys with a free suffix.
    const output = {};
    const inspected = inspectEntries(value, limits.maxKeys);
    // codescope ignore this because sensitive keys receive markers before recursive circular checks.
    // codescope ignore this because the contract requires an empty object after a retained getter fails.
    if (inspected.failed) return {};
    // codescope ignore this because recursive classification catches hostile child proxies and returns {}.
    for (const [key, child] of inspected.entries)
      Object.defineProperty(output, key, {
        // codescope ignore this because Object.keys returns string property names.
        value: policy.keys.has(key.toLowerCase())
          ? policy.marker
          : redact(child, policy, limits, seen, depth + 1),
        enumerable: true,
        configurable: true,
        writable: true,
      });
    // codescope ignore this because truncation preserves the retained redacted value with a free suffix.
    if (inspected.truncated) addTruncationMarker(output);
    return output;
  } finally {
    seen.delete(value);
  }
}
