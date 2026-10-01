import { enforceDepthLimit } from "../limits/enforce-depth-limit.mjs";
import { circularValue } from "./circular-value.mjs";

export function serializeRecursiveValue(value, policy, limits, seen, depth, serializeComplex) {
  if (enforceDepthLimit(depth, limits.maxDepth)) return "[TRUNCATED]";
  if (seen.has(value)) return circularValue(policy.circularMarker);
  seen.add(value);
  try {
    return serializeComplex(value, depth);
  } finally {
    seen.delete(value);
  }
}
