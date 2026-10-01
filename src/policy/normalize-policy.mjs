import { defaultPolicy } from "./default-policy.mjs";
import { normalizeSensitiveKeys } from "./normalize-sensitive-keys.mjs";
import { validatePolicyOptions } from "./validate-policy-options.mjs";
import { buildNormalizedPolicy } from "./build-normalized-policy.mjs";

export function normalizePolicy(options = {}) {
  validatePolicyOptions(options, defaultPolicy);
  return buildNormalizedPolicy(options, normalizeSensitiveKeys(options.keys ?? defaultPolicy.keys));
}
