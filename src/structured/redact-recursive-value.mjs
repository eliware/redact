import { circularReferenceValue } from "./circular-reference-handler.mjs";
import { redactStructuredValue } from "./redact-structured-value.mjs";

export function redactRecursiveValue(value, policy, seen, depth) {
  if (value === null || typeof value !== "object") return value;
  if (depth > policy.maxDepth) return "[TRUNCATED]";
  if (seen.has(value)) return circularReferenceValue(policy);
  seen.set(value, true);
  try {
    return redactStructuredValue(value, policy, (child) =>
      redactRecursiveValue(child, policy, seen, depth + 1),
    );
  } finally {
    seen.delete(value);
  }
}
