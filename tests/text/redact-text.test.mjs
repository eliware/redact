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

test("converts nullish input to empty text", () => {
  expect(redactText()).toBe("");
  expect(redactText(null)).toBe("");
});
