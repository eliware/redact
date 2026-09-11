import { validatePolicyLimits } from "../../src/policy/validate-policy-limits.mjs";
test("validates non-negative policy limits", () =>
  expect(() =>
    validatePolicyLimits(
      { maxDepth: -1 },
      { maxDepth: 2, maxArray: 2, maxKeys: 2 },
    ),
  ).toThrow("maxDepth"));
