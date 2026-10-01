import { collectLiteralSecrets } from "../../src/text/collect-literal-secrets.mjs";
test("collects usable literal secrets", () =>
  expect(collectLiteralSecrets(["", "secret", 1])).toEqual(["secret"]));

test("caps consumed secrets at 100", () => {
  let consumed = 0;
  const secrets = {
    *[Symbol.iterator]() {
      while (true) yield `secret-${++consumed}`;
    },
  };
  expect(collectLiteralSecrets(secrets)).toHaveLength(100);
  expect(consumed).toBe(100);
});

test("rejects non-iterable secret inputs", () => {
  expect(() => collectLiteralSecrets(42)).toThrow("secrets must be iterable");
});
