import { normalizePolicy } from "./normalize-policy.mjs";
import { createReadonlySet } from "./create-readonly-set.mjs";

export function createPolicy(options = {}) {
  const policy = normalizePolicy(options);
  return Object.freeze({ ...policy, keys: createReadonlySet(policy.keys) });
}
