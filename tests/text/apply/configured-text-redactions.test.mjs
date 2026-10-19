import { applyConfiguredTextRedactions } from "../../../src/text/apply/configured-text-redactions.mjs";
import { normalizePolicy } from "../../../src/policy/normalize-policy.mjs";

test("applies configured keys and secrets before limiting output", () => {
  const options = {
    keys: ["customer_ref"],
    secrets: ["secret"],
    maxOutputLength: 100,
  };

  expect(
    applyConfiguredTextRedactions(
      "customer_ref=private note: secret",
      options,
      normalizePolicy(options),
    ),
  ).toBe("customer_ref=[REDACTED] note: [REDACTED]");
});

test("limits text after applying configured redactions", () => {
  const options = { secrets: ["secret"], maxOutputLength: 12 };

  expect(applyConfiguredTextRedactions("note: secret", options, normalizePolicy(options))).toBe(
    "n[TRUNCATED]",
  );
});
