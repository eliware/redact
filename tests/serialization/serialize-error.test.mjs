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
