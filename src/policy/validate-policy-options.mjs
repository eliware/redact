import { validatePolicyLimits } from "./validate-policy-limits.mjs";

export function validatePolicyOptions(options, defaults) {
  if (options.matchHeuristics != null && typeof options.matchHeuristics !== "boolean")
    throw new TypeError("matchHeuristics must be boolean");
  validatePolicyLimits(options, defaults);
}
