import { defaultPolicy } from "./default-policy.mjs";
import { normalizeSensitiveKeys } from "./normalize-sensitive-keys.mjs";
import { validatePolicyLimits } from "./validate-policy-limits.mjs";
import { buildNormalizedPolicy } from "./build-normalized-policy.mjs";

export function normalizePolicy(options = {}) {
  if (
    options.matchHeuristics != null &&
    typeof options.matchHeuristics !== "boolean"
  )
    throw new TypeError("matchHeuristics must be boolean");
  validatePolicyLimits(options, defaultPolicy);
  return buildNormalizedPolicy(
    options,
    normalizeSensitiveKeys(options.keys ?? defaultPolicy.keys),
  );
}
