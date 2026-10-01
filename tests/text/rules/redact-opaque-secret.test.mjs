import { redactOpaqueSecretRule } from "../../../src/text/rules/redact-opaque-secret.mjs";

test("redacts long opaque hexadecimal secrets", () => {
  expect("ABCDEF0123456789ABCDEF0123456789".replace(...redactOpaqueSecretRule)).toBe("[REDACTED]");
});
