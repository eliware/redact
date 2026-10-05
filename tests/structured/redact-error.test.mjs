import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";
import { redactError } from "../../src/structured/redact-error.mjs";

test("copies error fields and redacts sensitive custom properties", () => {
  const error = Object.assign(new Error("failed"), {
    stack: "",
    name: "CustomError",
    token: "secret",
    detail: "safe",
  });
  const redactChild = (value) => value;

  expect(redactError(error, normalizePolicy(), redactChild)).toEqual({
    name: "CustomError",
    message: "failed",
    token: "[REDACTED]",
    detail: "safe",
  });
});

test("copies a stack and redacts custom child values", () => {
  const error = Object.assign(new Error("failed"), { detail: { token: "secret" } });
  const redactChild = (value) => (value.token ? { token: "[REDACTED]" } : value);
  const output = redactError(error, normalizePolicy(), redactChild);

  expect(output.stack).toContain("Error: failed");
  expect(output.detail).toEqual({ token: "[REDACTED]" });
});

test("applies configured sensitive keys to standard Error fields", () => {
  const error = new Error("sensitive message");
  error.stack = "sensitive stack";
  const policy = normalizePolicy({ keys: ["name", "message", "stack"] });

  expect(redactError(error, policy, (value) => value)).toEqual({
    name: "[REDACTED]",
    message: "[REDACTED]",
    stack: "[REDACTED]",
  });
});
