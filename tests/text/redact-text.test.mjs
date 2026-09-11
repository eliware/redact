import { redactText, replaceLiteralSecret } from "../../src/index.mjs";

test("bounds secret iterable consumption and validates policy booleans", () => {
  let consumed = 0;
  const secrets = {
    *[Symbol.iterator]() {
      while (true) {
        consumed += 1;
        yield `secret-${consumed}`;
      }
    },
  };
  redactText("safe", { secrets });
  expect(consumed).toBe(100);
});

test("redacts common credential-shaped text", () => {
  const output = redactText(
    "Authorization: Bearer abc token=secret ?api_key=key",
  );
  expect(output).not.toContain("abc");
  expect(output).not.toContain("secret");
  expect(output).not.toContain("=key");
});

test("replaces configured literal secrets", () => {
  expect(replaceLiteralSecret("password is abc", "abc")).toBe(
    "password is [REDACTED]",
  );
});

test("supports configured secrets and empty input", () => {
  expect(
    redactText("value=known", { secrets: ["known"], marker: "<hidden>" }),
  ).toBe("value=[REDACTED]");
  expect(redactText("value=known", { secrets: ["known"] })).toBe(
    "value=[REDACTED]",
  );
  expect(redactText()).toBe("");
});

test("ignores empty and non-string literal secrets", () => {
  expect(redactText("value=known", { secrets: ["", null, 42] })).toBe(
    "value=known",
  );
});

test("does not rewrite generated markers with later secrets", () => {
  expect(redactText("value=first", { secrets: ["first", "[REDACTED]"] })).toBe(
    "value=[REDACTED]",
  );
});

test("ignores removed custom marker options", () => {
  expect(redactText("token=secret", { marker: "<hidden>" })).toBe(
    "token=[REDACTED]",
  );
});

test("bounds text output with a distinguishable truncation marker", () => {
  const output = redactText("token=secret and more text", { maxString: 20 });
  expect(output.length).toBe(20);
  expect(output).toContain("[TRUNCATED]");
  expect(redactText("long value", { maxString: 5 })).toBe("long ");
});

test("redacts a secret that crosses the output boundary before truncating", () => {
  const output = redactText(`${"x".repeat(9_995)} token=secret`, {
    maxString: 10_000,
  });
  expect(output).not.toContain("secret");
  expect(output.length).toBe(10_000);
  expect(output).toContain("[TRUNCATED]");
});

test("does not expose secrets at the boundary when the marker cannot fit", () => {
  const output = redactText(`${"x".repeat(10_000)} token=secret`, {
    maxString: 10_000,
  });
  const shortOutput = redactText("token=secret", { maxString: 5 });
  expect(output).not.toContain("secret");
  expect(output).toContain("[TRUNCATED]");
  expect(shortOutput).toBe("token");
  expect(shortOutput).not.toContain("secret");
});

test("rejects invalid text size limits", () => {
  expect(() => redactText("value", { maxString: -1 })).toThrow(
    "maxString must be a non-negative integer",
  );
  expect(() => redactText("value", { secrets: 42 })).toThrow(
    "secrets must be iterable",
  );
});
