import { replaceLiteralSecrets } from "../../src/text/replace-literal-secrets.mjs";

test("replaces overlapping configured secrets as one covered span", () => {
  expect(replaceLiteralSecrets("abcde", ["abc", "bcde"])).toBe("[REDACTED]");
});

// codescope ignore this because repeated `aaa` matches overlap at starts 0, 1, and 2.
test("replaces overlapping repeated occurrences without exposing fragments", () => {
  expect(replaceLiteralSecrets("aaaaa", ["aaa"])).toBe("[REDACTED]");
});

test("merges contained secret matches", () => {
  expect(replaceLiteralSecrets("abcde", ["abcde", "bcd"])).toBe("[REDACTED]");
});

test("preserves surrounding text and supports a custom marker", () => {
  expect(replaceLiteralSecrets("prefix secret suffix", ["secret"], "[HIDDEN]")).toBe(
    "prefix [HIDDEN] suffix",
  );
});

test("merges duplicate occurrences of the same configured secret", () => {
  expect(replaceLiteralSecrets("secret", ["secret", "secret"])).toBe("[REDACTED]");
});

// codescope ignore this because the contract merges overlaps but keeps adjacent matches separate.
test("keeps separate markers for adjacent secret matches", () => {
  expect(replaceLiteralSecrets("firstsecond", ["first", "second"])).toBe("[REDACTED][REDACTED]");
});

test("preserves text when there are no non-empty secrets", () => {
  expect(replaceLiteralSecrets("safe text", ["", "absent"])).toBe("safe text");
  expect(replaceLiteralSecrets("safe text")).toBe("safe text");
  expect(replaceLiteralSecrets(undefined, ["secret"])).toBe("");
});

test("matches configured secrets as literal text", () => {
  expect(replaceLiteralSecrets("value=[secret]", ["[secret]"])).toBe("value=[REDACTED]");
});

test("treats a string secret option as one literal secret", () => {
  expect(replaceLiteralSecrets("secret and s", "secret")).toBe("[REDACTED] and s");
});
