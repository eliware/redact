import {
  redactConfiguredKeyValues,
  redactKeyValues,
} from "../../../src/text/rules/redact-key-values.mjs";

test("redacts sensitive named assignments and query values", () => {
  expect(redactKeyValues("token=secret ?api_key=key")).toBe("token=[REDACTED] ?api_key=[REDACTED]");
});

test("preserves nonsensitive values", () => {
  expect(redactKeyValues("mode=safe ?page=2")).toBe("mode=safe ?page=2");
});

test("redacts configured key assignments and query values", () => {
  const keys = new Set(["customer_ref"]);
  expect(redactConfiguredKeyValues('customer_ref=private ?customer_ref="query value"', keys)).toBe(
    "customer_ref=[REDACTED] ?customer_ref=[REDACTED]",
  );
});

test("escapes configured key names before matching", () => {
  expect(redactConfiguredKeyValues("customer.ref=private", ["customer.ref"])).toBe(
    "customer.ref=[REDACTED]",
  );
});

test("returns text unchanged when no configured keys are supplied", () => {
  expect(redactConfiguredKeyValues(undefined, [""])).toBe("");
});
