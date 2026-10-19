import { redactJwt } from "../../../../src/text/rules/redact/jwt.mjs";

test("applies the JWT pattern to text", () => {
  expect(redactJwt("jwt=eyJhbGci.eyJzdWIg.ZXhhbXBsZQ")).toBe("jwt=[REDACTED]");
});
