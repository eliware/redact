import { inspectEntries, safeEntries } from "../../src/inspection/safe-entries.mjs";

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

test("distinguishes failed enumeration from a genuinely empty object", () => {
  const hostile = new Proxy(
    {},
    {
      ownKeys() {
        throw new Error("blocked");
      },
    },
  );

  expect(inspectEntries({})).toEqual({ entries: [], failed: false, truncated: false });
  expect(inspectEntries(hostile)).toEqual({ entries: [], failed: true, truncated: false });
});

test("limits property reads and performs only a key-only overflow lookahead", () => {
  const value = { first: 1 };
  Object.defineProperty(value, "second", {
    enumerable: true,
    get() {
      throw new Error("overflow value must not be read");
    },
  });

  expect(inspectEntries(value, 1)).toEqual({
    entries: [["first", 1]],
    failed: false,
    truncated: true,
  });
});
