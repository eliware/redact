import { redactValue } from "../../src/structured/redact-value.mjs";

test("redacts nested sensitive values without mutating input", () => {
  const input = { token: "secret", nested: { Password: "pass", ok: 1 }, list: [{ apiKey: "key" }] };
  expect(redactValue(input)).toEqual({
    token: "[REDACTED]",
    nested: { Password: "[REDACTED]", ok: 1 },
    list: [{ apiKey: "[REDACTED]" }],
  });
  expect(input.token).toBe("secret");
});

test("handles cycles", () => {
  const input = { token: "secret" };
  input.self = input;
  expect(redactValue(input).self).toBe("[CIRCULAR]");
});

test("coordinates Error redaction with recursive child values", () => {
  const error = Object.assign(new Error("failed"), {
    detail: { token: "secret" },
  });
  error.self = error;

  expect(redactValue(error)).toMatchObject({
    name: "Error",
    message: "failed",
    detail: { token: "[REDACTED]" },
    self: "[CIRCULAR]",
  });
});
