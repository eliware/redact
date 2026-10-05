import { safeEntries } from "../../src/inspection/safe-entries.mjs";

test("reads enumerable own entries", () => {
  expect(safeEntries({ safe: 1, hidden: undefined })).toEqual([
    ["safe", 1],
    ["hidden", undefined],
  ]);
});

test("returns no entries when enumeration throws", () => {
  const hostile = new Proxy(
    {},
    {
      ownKeys() {
        throw new Error("blocked");
      },
    },
  );

  expect(safeEntries(hostile)).toEqual([]);
});
