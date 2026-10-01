import { redactProviderKeyRule } from "../../../src/text/rules/redact-provider-key.mjs";

test("redacts supported provider API key formats", () => {
  expect("AIza12345678901234567890".replace(...redactProviderKeyRule)).toBe("[REDACTED]");
  expect("AKIA1234567890ABCDEF".replace(...redactProviderKeyRule)).toBe("[REDACTED]");
});
