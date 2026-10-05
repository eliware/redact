import { redactAuthorization } from "../../../src/text/rules/redact-authorization.mjs";

test("redacts authorization header and bearer values", () => {
  expect(redactAuthorization("Authorization: Bearer example-token")).toBe(
    "Authorization: Bearer [REDACTED]",
  );
  expect(redactAuthorization("Bearer example-token")).toBe("Bearer [REDACTED]");
});

test("preserves text without authorization values", () => {
  expect(redactAuthorization("ordinary diagnostic text")).toBe("ordinary diagnostic text");
});
