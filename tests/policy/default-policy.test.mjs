import { defaultPolicy } from "../../src/policy/default-policy.mjs";
import { redactValue } from "../../src/structured/redact-value.mjs";

test("provides the default marker and key policy", () => {
  expect(defaultPolicy.marker).toBe("[REDACTED]");
  expect(defaultPolicy.keys.has("authorization")).toBe(true);
  expect(Object.isFrozen(defaultPolicy.keys)).toBe(true);
  expect(defaultPolicy.keys.delete).toBeUndefined();
  expect(redactValue({ token: "secret" })).toEqual({ token: "[REDACTED]" });
});
