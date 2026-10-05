import { safeEntries } from "../inspection/safe-entries.mjs";

export function redactError(error, policy, redactChild) {
  const output = { name: error.name, message: error.message };
  if (error.stack) output.stack = error.stack;
  for (const [key, child] of safeEntries(error)) {
    if (!(key in output))
      output[key] = policy.keys.has(key.toLowerCase()) ? policy.marker : redactChild(child);
  }
  return output;
}
