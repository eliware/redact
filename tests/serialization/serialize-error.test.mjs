import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";
import { DEFAULT_LIMITS } from "../../src/limits/default-limits.mjs";
import { serializeError } from "../../src/serialization/serialize-error.mjs";

test("serializes error fields and redacts sensitive properties", () => {
  const error = Object.assign(new Error("failed"), {
    stack: "",
    name: "CustomError",
    token: "secret",
    detail: "safe",
  });
  const policy = normalizePolicy({ keys: ["message", "token"] });
  const serialize = (value) => value;
  const output = serializeError(error, policy, DEFAULT_LIMITS, new WeakSet(), 0, serialize);

  expect(output).toEqual({
    name: "CustomError",
    message: "[REDACTED]",
    token: "[REDACTED]",
    detail: "safe",
  });
});

test("serializes stack and delegates safe property values", () => {
  const error = Object.assign(new Error("failed"), { detail: { safe: true } });
  const policy = normalizePolicy();
  const serialize = (value) => (typeof value === "string" ? `serialized:${value}` : value);
  const output = serializeError(error, policy, DEFAULT_LIMITS, new WeakSet(), 0, serialize);

  expect(output.name).toBe("serialized:Error");
  expect(output.message).toBe("serialized:failed");
  expect(output.stack).toContain("serialized:Error: failed");
  expect(output.detail).toEqual({ safe: true });
});

test("applies configured sensitive keys to Error name and stack", () => {
  const error = Object.assign(new Error("message"), {
    name: "sensitive name",
    stack: "sensitive stack",
  });
  const policy = normalizePolicy({ keys: ["name", "stack"] });
  const output = serializeError(error, policy, DEFAULT_LIMITS, new WeakSet(), 0, (value) => value);

  expect(output).toMatchObject({
    name: "[REDACTED]",
    stack: "[REDACTED]",
  });
});

test("returns an empty object when a custom Error property cannot be read", () => {
  const error = new Error("failed");
  Object.defineProperty(error, "blocked", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });

  expect(
    serializeError(error, normalizePolicy(), DEFAULT_LIMITS, new WeakSet(), 0, (value) => value),
  ).toEqual({});
});

test("marks omitted custom Error properties after the maxKeys bound", () => {
  const error = Object.assign(new Error("failed"), { first: 1, second: 2 });
  const limits = { ...DEFAULT_LIMITS, maxKeys: 1 };

  expect(
    serializeError(error, normalizePolicy(), limits, new WeakSet(), 0, (value) => value),
  ).toMatchObject({ first: 1, __truncated: "[TRUNCATED]" });
});
