import { redactObject } from "../../../src/structured/redact/object.mjs";
import { normalizePolicy } from "../../../src/policy/normalize-policy.mjs";
import { DEFAULT_LIMITS } from "../../../src/limits/default-limits.mjs";

test("redacts sensitive object properties", () => {
  const output = redactObject(
    { token: "secret", visible: "value" },
    normalizePolicy(),
    DEFAULT_LIMITS,
    (value) => value,
  );

  expect(output).toEqual({ token: "[REDACTED]", visible: "value" });
});

test("marks object properties omitted by maxKeys", () => {
  const output = redactObject(
    { first: "one", second: "two" },
    normalizePolicy(),
    { ...DEFAULT_LIMITS, maxKeys: 1 },
    (value) => value,
  );

  expect(output).toEqual({ first: "one", __truncated: "[TRUNCATED]" });
});

test("marks properties omitted by a maxKeys limit", () => {
  const output = redactObject(
    { first: "one", second: "two" },
    normalizePolicy(),
    { ...DEFAULT_LIMITS, maxKeys: 1 },
    (value) => value,
  );

  expect(output).toEqual({ first: "one", __truncated: "[TRUNCATED]" });
});

test("preserves a retained truncation key and uses a new marker key", () => {
  const output = redactObject(
    { __truncated: "kept", omitted: "value" },
    normalizePolicy(),
    { ...DEFAULT_LIMITS, maxKeys: 1 },
    (value) => value,
  );

  expect(output).toEqual({ __truncated: "kept", __truncated_1: "[TRUNCATED]" });
});

test("preserves an own __proto__ property as data", () => {
  const input = {};
  Object.defineProperty(input, "__proto__", { value: { visible: "value" }, enumerable: true });

  const output = redactObject(input, normalizePolicy(), DEFAULT_LIMITS, (value) => value);

  expect(Object.hasOwn(output, "__proto__")).toBe(true);
  expect(output.__proto__).toEqual({ visible: "value" });
  expect(Object.getPrototypeOf(output)).toBe(Object.prototype);
});

test("returns an empty object when a retained property read fails", () => {
  const input = { visible: "value" };
  Object.defineProperty(input, "blocked", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });

  expect(redactObject(input, normalizePolicy(), DEFAULT_LIMITS, (value) => value)).toEqual({});
});
