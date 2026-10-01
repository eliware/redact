import { redactProviderTokenRule } from "../../../src/text/rules/redact-provider-token.mjs";

test("defines a provider token rule", () =>
  expect("ghp_example".replace(...redactProviderTokenRule)).toBe("[REDACTED]"));

test("redacts Slack and OpenAI tokens without changing ordinary identifiers", () => {
  const value = "xoxb-123456789012 sk-test_123456789012 ordinary_identifier_123";
  const redacted = value.replace(...redactProviderTokenRule);
  expect(redacted).not.toContain("xoxb-123456789012");
  expect(redacted).not.toContain("sk-test_123456789012");
  expect(redacted).toContain("ordinary_identifier_123");
});
