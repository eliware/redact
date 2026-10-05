import { redactProviderToken } from "../../../src/text/rules/redact-provider-token.mjs";

test("redacts supported provider token prefixes", () => {
  expect(redactProviderToken("github token ghp_Example123")).toBe("github token [REDACTED]");
});

test("preserves strings without a provider token", () => {
  expect(redactProviderToken("ordinary diagnostic text")).toBe("ordinary diagnostic text");
});
