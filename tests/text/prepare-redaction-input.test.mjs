import { prepareRedactionInput } from "../../src/text/prepare-redaction-input.mjs";

test("converts input to text and reports whether the original exceeds the limit", () => {
  expect(prepareRedactionInput(null, 1)).toEqual({ input: "", inputTruncated: false });
  expect(prepareRedactionInput("long", 3)).toEqual({ input: "long", inputTruncated: true });
});
