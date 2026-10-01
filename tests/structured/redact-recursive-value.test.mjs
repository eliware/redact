import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";
import { redactRecursiveValue } from "../../src/structured/redact-recursive-value.mjs";

test("returns primitives directly and recursively redacts nested value kinds", () => {
  const policy = normalizePolicy();
  const value = { token: "secret", list: [1, { password: "secret" }] };
  expect(redactRecursiveValue("text", policy, new WeakMap(), 0)).toBe("text");
  expect(redactRecursiveValue(value, policy, new WeakMap(), 0)).toEqual({
    token: "[REDACTED]",
    list: [1, { password: "[REDACTED]" }],
  });
});

test("enforces traversal depth and path-local cycle detection", () => {
  const policy = normalizePolicy({ maxDepth: 0 });
  const cycle = {};
  cycle.self = cycle;
  expect(redactRecursiveValue({ nested: {} }, policy, new WeakMap(), 0)).toEqual({
    nested: "[TRUNCATED]",
  });
  expect(redactRecursiveValue(cycle, normalizePolicy(), new WeakMap(), 0)).toEqual({
    self: "[CIRCULAR]",
  });
});
