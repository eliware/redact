import { redactPrivateKeyRule } from "../../../src/text/rules/redact-private-key.mjs";

test("defines a private-key rule", () =>
  expect("-----BEGIN KEY-----x-----END KEY-----".replace(...redactPrivateKeyRule)).toBe(
    "[REDACTED]",
  ));

test("redacts key material when PEM boundary labels do not match", () => {
  const values = [
    "-----BEGIN PRIVATE KEY-----private-payload-----END RSA PRIVATE KEY-----",
    "-----BEGIN RSA-PSS PRIVATE KEY-----private-payload-----END EC PRIVATE KEY-----",
  ];
  for (const value of values) expect(value.replace(...redactPrivateKeyRule)).toBe("[REDACTED]");
});

test("redacts private-key blocks with hyphens in their PEM labels", () =>
  expect(
    "-----BEGIN RSA-PSS PRIVATE KEY-----private-payload-----END RSA-PSS PRIVATE KEY-----".replace(
      ...redactPrivateKeyRule,
    ),
  ).toBe("[REDACTED]"));
