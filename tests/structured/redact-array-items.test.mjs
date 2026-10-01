import { redactArrayItems } from "../../src/structured/redact-array-items.mjs";

test("redacts each selected item and preserves siblings when one fails", () => {
  expect(
    redactArrayItems([1, 2], { keys: new Set() }, (value) => {
      if (value === 2) throw new Error("blocked");
      return value * 2;
    }),
  ).toEqual([2, "[UNSERIALIZABLE]"]);
});
