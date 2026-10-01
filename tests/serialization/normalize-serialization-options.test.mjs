import { normalizeSerializationOptions } from "../../src/serialization/normalize-serialization-options.mjs";

test("normalizes policy, limits, and reusable literal secrets together", () => {
  const { policy, limits } = normalizeSerializationOptions({
    keys: ["TOKEN"],
    maxString: 20,
    secrets: ["secret"],
  });
  expect(policy.keys.has("token")).toBe(true);
  expect(limits.maxString).toBe(20);
  expect(limits.secrets).toEqual(["secret"]);
});

test("supplies defaults when options are omitted", () => {
  const { policy, limits } = normalizeSerializationOptions();
  expect(policy.maxDepth).toBe(20);
  expect(limits.maxString).toBe(10_000);
  expect(limits.secrets).toEqual([]);
});

test("validates serialization options before traversal", () => {
  expect(() => normalizeSerializationOptions({ maxString: -1 })).toThrow(
    "maxString must be a non-negative integer",
  );
  expect(() => normalizeSerializationOptions({ secrets: 42 })).toThrow("secrets must be iterable");
});
