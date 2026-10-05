import { DEFAULT_LIMITS } from "../../src/limits/default-limits.mjs";
import { normalizeTraversalLimits } from "../../src/limits/normalize-traversal-limits.mjs";

test("uses finite nonnegative integer traversal limits", () => {
  expect(normalizeTraversalLimits({ maxDepth: 2.9, maxKeys: 1.9, maxArray: 3.9 })).toMatchObject({
    maxDepth: 2,
    maxKeys: 1,
    maxArray: 3,
  });
  expect(normalizeTraversalLimits({ maxDepth: -1, maxKeys: -2, maxArray: -3 })).toMatchObject({
    maxDepth: 0,
    maxKeys: 0,
    maxArray: 0,
  });
});

test("replaces non-finite traversal limits with defaults", () => {
  for (const invalid of [Infinity, -Infinity, Number.NaN]) {
    expect(
      normalizeTraversalLimits({ maxDepth: invalid, maxKeys: invalid, maxArray: invalid }),
    ).toMatchObject(DEFAULT_LIMITS);
  }
});

test("uses default limits when options are omitted", () => {
  expect(normalizeTraversalLimits()).toEqual(DEFAULT_LIMITS);
});
