import { readBoundedObjectEntries } from "../../src/structured/read-bounded-object-entries.mjs";

test("returns bounded entries and reports excess source entries", () => {
  expect(readBoundedObjectEntries({ a: 1, b: 2 }, 1)).toEqual({
    entries: [["a", 1]],
    truncated: true,
  });
  expect(readBoundedObjectEntries({ a: 1 }, 1)).toEqual({
    entries: [["a", 1]],
    truncated: false,
  });
});

test("handles zero and unlimited entry bounds", () => {
  expect(readBoundedObjectEntries({ a: 1 }, 0)).toEqual({ entries: [], truncated: true });
  expect(readBoundedObjectEntries({ a: 1 }, Number.POSITIVE_INFINITY)).toEqual({
    entries: [["a", 1]],
    truncated: false,
  });
});
