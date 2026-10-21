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
  expect(redactText("note: known", { secrets: "known" })).toBe("note: [REDACTED]");
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

test("applies default sensitive keys to text assignments", () => {
  expect(redactText("cookie=secret privatekey=key passphrase=phrase")).toBe(
    "cookie=[REDACTED] privatekey=[REDACTED] passphrase=[REDACTED]",
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

test("converts nullish input to empty text", () => {
  expect(redactText()).toBe("");
  expect(redactText(null)).toBe("");
});

test("limits input before applying redaction rules", () => {
  expect(
    redactText(`${"x".repeat(100)}-----BEGIN PRIVATE KEY-----secret`, { maxOutputLength: 20 }),
  ).toBe("xxxxxxxxx[TRUNCATED]");
});

test("uses the default input bound for non-finite output limits", () => {
  expect(redactText("x".repeat(10_001), { maxOutputLength: Number.NaN })).toHaveLength(10_000);
});

test("redacts a JWT that crosses the default text limit", () => {
  const token = `eyJabcde.${"payload".repeat(20)}.signature`;
  const input = `${"x".repeat(9_979)} ${token}`;
  const output = redactText(input);

  expect(output).not.toContain("eyJabcde");
  expect(output).not.toContain("payload");
  expect(output).toContain("[REDACTED]");
  expect(output).toContain("[TRUNCATED]");
  expect(output).toHaveLength(10_000);
});

test("redacts a JWT that crosses a custom text limit", () => {
  const token = `eyJabcde.${"payload".repeat(20)}.signature`;
  const input = `${"x".repeat(39)} ${token}`;
  const output = redactText(input, { maxOutputLength: 64 });

  expect(output).not.toContain("eyJabcde");
  expect(output).not.toContain("payload");
  expect(output).toContain("[REDACTED]");
  expect(output).toContain("[TRUNCATED]");
  expect(output.length).toBeLessThanOrEqual(64);
});

test.each([9, 11, 20])("keeps JWT boundary output within a %i-character limit", (limit) => {
  const output = redactText("eyJabcde.payload.signature", { maxOutputLength: limit });

  expect(output.length).toBeLessThanOrEqual(limit);
  expect(output).not.toContain("eyJabcde");
  expect(output).not.toContain("payload");
  expect(output).not.toContain("signature");
  if (limit === 9) expect(output).toBe("…");
  if (limit >= 11) expect(output).toContain("[TRUNCATED]");
});

test("redacts a complete JWT before the text limit", () => {
  const output = redactText(`jwt=eyJhbGci.eyJzdWIg.ZXhhbXBsZQ${"x".repeat(100)}`, {
    maxOutputLength: 64,
  });

  expect(output).toContain("jwt=[REDACTED]");
  expect(output).toContain("[TRUNCATED]");
  expect(output.length).toBeLessThanOrEqual(64);
});

test("does not treat a JWT beyond the text limit as a boundary crossing", () => {
  const token = "eyJabcde.payload.signature";
  const output = redactText(`${"x".repeat(64)} ${token}${"S".repeat(40)}`, {
    maxOutputLength: 64,
    secrets: ["S".repeat(40)],
  });

  expect(output).not.toContain("eyJabcde");
  expect(output).toContain("[TRUNCATED]");
});

test("redacts configured secrets that cross the input limit", () => {
  const secret = "SECRET_VALUE_12345";
  const output = redactText(`${"x".repeat(35)}${secret}`, {
    maxOutputLength: 50,
    secrets: [secret],
  });

  expect(output).not.toContain("SECRET");
  expect(output).toHaveLength(50);
});

test("keeps complete configured secrets after built-in rules shorten the prefix", () => {
  const secret = "SECRET_VALUE_12345";
  const keyMaterial = "-----BEGIN PRIVATE KEY-----x-----END PRIVATE KEY-----";
  const input = `${keyMaterial}${"x".repeat(60 - keyMaterial.length)}${secret}`;
  const output = redactText(input, { maxOutputLength: 60, secrets: [secret] });

  expect(output).not.toContain("SECRET");
  expect(output).toContain("[REDACTED]");
});

test("redacts key material when a bounded input cuts off its closing delimiter", () => {
  const input = `-----BEGIN PRIVATE KEY-----${"secret".repeat(20)}`;

  expect(redactText(input, { maxOutputLength: 40 })).toBe("[REDACTED][TRUNCATED]");
});
