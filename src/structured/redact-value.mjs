import { normalizePolicy } from "../policy/normalize-policy.mjs";
import { redactRecursiveValue } from "./redact-recursive-value.mjs";

export function redactValue(value, options = {}) {
  const policy = normalizePolicy(options);
  return redactRecursiveValue(value, policy, new WeakMap(), 0);
}
