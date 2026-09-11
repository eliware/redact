import { buildNormalizedPolicy } from "../../src/policy/build-normalized-policy.mjs";
import { readonlySet } from "../../src/policy/readonly-set.mjs";
test("builds normalized policy fields", () =>
  expect(
    buildNormalizedPolicy({}, readonlySet(new Set(["token"]))).keys.has(
      "token",
    ),
  ).toBe(true));
