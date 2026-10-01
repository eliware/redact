import { TEXT_REDACTION_RULES } from "../../src/text/text-redaction-rule-set.mjs";
import { redactPrivateKeyRule } from "../../src/text/rules/redact-private-key.mjs";

test("keeps private-key redaction first in the shared text rule order", () => {
  expect(TEXT_REDACTION_RULES[0]).toBe(redactPrivateKeyRule);
  expect(Object.isFrozen(TEXT_REDACTION_RULES)).toBe(true);
});
