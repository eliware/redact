import { inspectEntries } from "../inspection/safe-entries.mjs";

export function redactError(error, policy, redactChild, maxKeys = Infinity) {
  const output = {
    name: policy.keys.has("name") ? policy.marker : redactChild(error.name),
    message: policy.keys.has("message") ? policy.marker : redactChild(error.message),
  };
  if (error.stack)
    output.stack = policy.keys.has("stack") ? policy.marker : redactChild(error.stack);
  const inspected = inspectEntries(error, maxKeys, (key) => !Object.hasOwn(output, key));
  if (inspected.failed) return {};
  for (const [key, child] of inspected.entries)
    output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : redactChild(child);
  if (inspected.truncated) output.__truncated = "[TRUNCATED]";
  return output;
}
