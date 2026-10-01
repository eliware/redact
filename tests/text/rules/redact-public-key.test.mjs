import { redactPublicKeyRule } from "../../../src/text/rules/redact-public-key.mjs";

test("redacts SSH public key material", () => {
  expect("ssh-ed25519 AAAAxyz user@example".replace(...redactPublicKeyRule)).toBe("[REDACTED]");
});
