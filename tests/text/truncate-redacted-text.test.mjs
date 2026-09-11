import { truncateRedactedText } from "../../src/text/truncate-redacted-text.mjs";
test("truncates with marker", () =>
  expect(truncateRedactedText("abcdef", 15, true)).toBe("abcd[TRUNCATED]"));
