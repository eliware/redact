import { redactArrayItems } from "./redact-array-items.mjs";
import { selectBoundedArray } from "./select-bounded-array.mjs";

export function redactArray(value, policy, redactChild) {
  let limit;
  try {
    limit = policy.maxArray ?? value.length;
  } catch {
    return [];
  }
  const selection = selectBoundedArray(value, limit);
  if (!selection) return [];
  const output = redactArrayItems(selection.items, policy, redactChild);
  if (selection.truncated) output.push("[TRUNCATED]");
  return output;
}
