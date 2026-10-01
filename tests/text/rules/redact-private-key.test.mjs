import { redactPrivateKeyRule } from "../../../src/text/rules/redact-private-key.mjs";

test("defines a private-key rule", () =>
  expect("-----BEGIN KEY-----x-----END KEY-----".replace(...redactPrivateKeyRule)).toBe(
    "[REDACTED]",
  ));

test("redacts key material when PEM boundary labels do not match", () =>
  expect(
    "-----BEGIN PRIVATE KEY-----private-payload-----END RSA PRIVATE KEY-----".replace(
      ...redactPrivateKeyRule,
    ),
  ).toBe("[REDACTED]"));
