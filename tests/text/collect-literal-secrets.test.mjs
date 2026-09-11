import { collectLiteralSecrets } from "../../src/text/collect-literal-secrets.mjs";
test("collects usable literal secrets", () =>
  expect(collectLiteralSecrets(["", "secret", 1])).toEqual(["secret"]));
