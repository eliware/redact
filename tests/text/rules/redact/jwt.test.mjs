import { redactJwt } from "../../../../src/text/rules/redact/jwt.mjs";

test("converts nullish input to empty text", () => {
  expect(redactJwt()).toBe("");
  expect(redactJwt(null)).toBe("");
});
