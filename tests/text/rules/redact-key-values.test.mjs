import { redactKeyValues } from "../../../src/text/rules/redact-key-values.mjs";

test("redacts sensitive named assignments and query values", () => {
  expect(redactKeyValues("token=secret ?api_key=key")).toBe("token=[REDACTED] ?api_key=[REDACTED]");
});

test("preserves nonsensitive values", () => {
  expect(redactKeyValues("mode=safe ?page=2")).toBe("mode=safe ?page=2");
});
