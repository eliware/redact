import { defaultPolicy } from "../../src/policy/default-policy.mjs";
import { validatePolicyOptions } from "../../src/policy/validate-policy-options.mjs";

test("accepts valid option types and limits", () => {
  expect(() =>
    validatePolicyOptions({ matchHeuristics: false, maxDepth: 2 }, defaultPolicy),
  ).not.toThrow();
});

test("rejects an invalid heuristic option and delegates limit validation", () => {
  expect(() => validatePolicyOptions({ matchHeuristics: "yes" }, defaultPolicy)).toThrow(
    "matchHeuristics must be boolean",
  );
  expect(() => validatePolicyOptions({ maxKeys: -1 }, defaultPolicy)).toThrow(
    "maxKeys must be a non-negative integer",
  );
});
