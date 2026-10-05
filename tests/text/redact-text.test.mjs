import { redactText } from "../../src/text/redact-text.mjs";

test("coordinates built-in rules in an order that hides key material first", () => {
  expect(redactText("-----BEGIN PRIVATE KEY-----\ntoken=secret\n-----END PRIVATE KEY-----")).toBe(
    "[REDACTED]",
  );
});

test("applies configured literal secrets after built-in rules", () => {
  expect(redactText("note: known", { secrets: ["known"], marker: "<hidden>" })).toBe(
    "note: <hidden>",
  );
  expect(redactText("note: known", { secrets: ["known"] })).toBe("note: [REDACTED]");
});

test("applies configured sensitive keys to text assignments", () => {
  expect(redactText("customer_ref=private", { keys: ["customer_ref"] })).toBe(
    "customer_ref=[REDACTED]",
  );
  expect(redactText("customer_ref=private", { redactKeys: ["customer_ref"] })).toBe(
    "customer_ref=[REDACTED]",
  );
  expect(redactText("customer_ref=private", { keys: ["customer_ref"], marker: "<hidden>" })).toBe(
    "customer_ref=<hidden>",
  );
});

test("replaces overlapping configured secrets without exposing fragments", () => {
  expect(redactText("abcde", { secrets: ["abc", "bcde"] })).toBe("[REDACTED]");
});

test.each([
  ["query secrets", "request ?api_key=query-secret", "request ?api_key=[REDACTED]"],
  ["provider tokens", "github token ghp_Example123", "github token [REDACTED]"],
  ["JWTs", "jwt=eyJhbGci.eyJzdWIg.ZXhhbXBsZQ", "jwt=[REDACTED]"],
])("coordinates the %s rule through redactText", (_name, input, expected) => {
  expect(redactText(input)).toBe(expected);
});

test("bounds output and reserves space for a truncation marker", () => {
  const output = redactText("x".repeat(30), { maxOutputLength: 15 });
  expect(output).toBe("xxxx[TRUNCATED]");
  expect(output).toHaveLength(15);
});

test("keeps output within very small configured bounds", () => {
  expect(redactText("long text", { maxOutputLength: 5 })).toBe("…");
  expect(redactText("long text", { maxOutputLength: 0 })).toBe("");
});

test("uses the default output bound for non-finite limits", () => {
  expect(redactText("x".repeat(10001), { maxOutputLength: Number.NaN })).toHaveLength(10000);
});

test("converts nullish input to empty text", () => {
  expect(redactText()).toBe("");
  expect(redactText(null)).toBe("");
});
