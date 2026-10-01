import { redactOpaqueBase64Rule } from "../../../src/text/rules/redact-opaque-base64.mjs";

test("redacts long opaque base64-like secrets containing digits", () => {
  expect("ABCDEFGHIJKLMNOPQRSTUVWXYZ123456".replace(...redactOpaqueBase64Rule)).toBe("[REDACTED]");
});
