import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";
import { redactStructuredValue } from "../../src/structured/redact-structured-value.mjs";

test("selects Error, array, and object redaction paths", () => {
  const policy = normalizePolicy();
  const redactChild = (value) => value;
  expect(redactStructuredValue([1], policy, redactChild)).toEqual([1]);
  expect(redactStructuredValue({ token: "secret" }, policy, redactChild)).toEqual({
    token: "[REDACTED]",
  });
  expect(redactStructuredValue(new Error("failed"), policy, redactChild)).toMatchObject({
    message: "failed",
  });
});
