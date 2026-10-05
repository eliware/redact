import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { inspectEntries } from "../inspection/safe-entries.mjs";
import { redactError } from "./redact-error.mjs";

export function redactValue(value, options = {}) {
  const policy = normalizePolicy(options);
  return redact(value, policy, new WeakMap());
}

function redact(value, policy, seen) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return policy.circularMarker ?? "[CIRCULAR]";
  if (value instanceof Error) {
    seen.set(value, true);
    try {
      return redactError(value, policy, (child) => redact(child, policy, seen));
    } finally {
      seen.delete(value);
    }
  }
  seen.set(value, true);
  try {
    if (Array.isArray(value)) return value.map((item) => redact(item, policy, seen));
    const output = {};
    const inspected = inspectEntries(value);
    if (inspected.failed) return {};
    for (const [key, child] of inspected.entries)
      output[key] = policy.keys.has(key.toLowerCase())
        ? policy.marker
        : redact(child, policy, seen);
    return output;
  } finally {
    seen.delete(value);
  }
}
