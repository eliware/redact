import { serializeRecursiveValue } from "../../src/serialization/serialize-recursive-value.mjs";

test("enforces depth and delegates values within bounds", () => {
  const value = {};
  const calls = [];
  const serialize = (...args) => {
    calls.push(args);
    return "serialized";
  };
  expect(serializeRecursiveValue(value, {}, { maxDepth: 1 }, new WeakSet(), 1, serialize)).toBe(
    "serialized",
  );
  expect(calls).toEqual([[value, 1]]);
  expect(serializeRecursiveValue(value, {}, { maxDepth: 0 }, new WeakSet(), 1, serialize)).toBe(
    "[TRUNCATED]",
  );
});

test("detects path cycles and always releases traversal state", () => {
  const value = {};
  const seen = new WeakSet([value]);
  expect(
    serializeRecursiveValue(value, { circularMarker: "[CYCLE]" }, {}, seen, 0, () => "unused"),
  ).toBe("[CYCLE]");
  const broken = new WeakSet();
  expect(() =>
    serializeRecursiveValue(value, {}, {}, broken, 0, () => {
      throw new Error("blocked");
    }),
  ).toThrow("blocked");
  expect(broken.has(value)).toBe(false);
});
