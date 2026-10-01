import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";
import { redactErrorStandardFields } from "../../src/structured/redact-error-standard-fields.mjs";

test("redacts configured standard fields and omits empty stacks", () => {
  expect(
    redactErrorStandardFields(
      { name: "RequestError", message: "private", stack: "" },
      normalizePolicy({ keys: ["message"] }),
      (value) => value,
    ),
  ).toEqual({ name: "RequestError", message: "[REDACTED]" });
});
