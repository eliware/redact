import { serializeStringValue } from "../../src/serialization/serialize-string-value.mjs";

test("redacts text patterns and literal secrets within string values", () => {
  expect(serializeStringValue("token=known", { maxString: 100, secrets: ["known"] })).toBe(
    "token=[REDACTED]",
  );
});

test("applies the serialized string size limit", () => {
  expect(serializeStringValue("abcdef", { maxString: 3 })).toBe("abc");
});
