import { redactKeyMaterial } from "../../../src/text/rules/redact-key-material.mjs";

test("redacts complete key material blocks", () => {
  expect(redactKeyMaterial("-----BEGIN PRIVATE KEY-----\nsecret\n-----END PRIVATE KEY-----")).toBe(
    "[REDACTED]",
  );
});

test("leaves text without a key material block unchanged", () => {
  expect(redactKeyMaterial("ordinary diagnostic text")).toBe("ordinary diagnostic text");
});
