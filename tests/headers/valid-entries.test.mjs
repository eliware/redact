import { validEntries } from "../../src/headers/valid-entries.mjs";

test("accepts empty and valid string entry lists", () => {
  expect(validEntries([])).toBe(true);
  expect(
    validEntries([
      ["authorization", "secret"],
      ["accept", "json"],
    ]),
  ).toBe(true);
});

test.each([[null], [[null]], [["key"]], [["key", "value", "extra"]], [[1, "value"]], [["key", 1]]])(
  "rejects malformed entry lists",
  (entries) => {
    expect(validEntries(entries)).toBe(false);
  },
);

test("rejects an entry list that throws during validation", () => {
  const entries = new Proxy([], {
    get(target, key, receiver) {
      if (key === "every") throw new Error("blocked");
      return Reflect.get(target, key, receiver);
    },
  });

  expect(validEntries(entries)).toBe(false);
});
