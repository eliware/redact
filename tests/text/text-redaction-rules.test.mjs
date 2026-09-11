import { applyTextRedactionRules } from "../../src/text/text-redaction-rules.mjs";
test("applies built-in text rules", () =>
  expect(applyTextRedactionRules("Authorization: Bearer secret")).toContain(
    "[REDACTED]",
  ));
