import { serializeError } from "../../src/serialization/serialize-error.mjs";

test("serializes an Error through the supplied callback", () => {
  const error = Object.assign(new Error("failed"), { token: "secret" });
  const policy = { keys: new Set(["token"]), marker: "[REDACTED]" };
  expect(serializeError(error, policy, (value) => value, 0)).toMatchObject({
    name: "Error",
    message: "failed",
    token: "[REDACTED]",
  });
});

test("does not let enumerable standard-field metadata overwrite redacted fields", () => {
  const error = new Error("safe");
  Object.defineProperties(error, {
    message: { value: "token=secret", enumerable: true, configurable: true },
    stack: { value: "stack-secret", enumerable: true, configurable: true },
  });
  const policy = { keys: new Set(["message", "stack"]), marker: "[REDACTED]" };
  expect(serializeError(error, policy, (value) => value, 0)).toMatchObject({
    message: "[REDACTED]",
    stack: "[REDACTED]",
  });
});
