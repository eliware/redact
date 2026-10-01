import { redactGenericAssignmentRule } from "../../../src/text/rules/redact-generic-assignment.mjs";

test("redacts generic uppercase credential assignments", () => {
  expect("TOKEN=secret".replace(...redactGenericAssignmentRule)).toBe("TOKEN=[REDACTED]");
});
