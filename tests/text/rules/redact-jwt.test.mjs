import { redactJwt } from "../../../src/text/rules/redact-jwt.mjs";

test("redacts JWT shaped values", () => {
  expect(redactJwt("jwt=eyJhbGci.eyJzdWIg.ZXhhbXBsZQ")).toBe("jwt=[REDACTED]");
});

test("preserves strings without a JWT shaped value", () => {
  expect(redactJwt("ordinary diagnostic text")).toBe("ordinary diagnostic text");
});
