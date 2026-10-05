import { inspectEntries } from "../inspection/safe-entries.mjs";

export function redactError(error, policy, redactChild) {
  const output = {
    name: policy.keys.has("name") ? policy.marker : redactChild(error.name),
    message: policy.keys.has("message") ? policy.marker : redactChild(error.message),
  };
  if (error.stack)
    output.stack = policy.keys.has("stack") ? policy.marker : redactChild(error.stack);
  const inspected = inspectEntries(error);
  if (inspected.failed) return {};
  for (const [key, child] of inspected.entries) {
    if (!(key in output))
      output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : redactChild(child);
  }
  return output;
}
