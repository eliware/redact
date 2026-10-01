import { readObjectEntries } from "../../src/structured/object-entry-reader.mjs";

test("reads safe enumerable entries and skips throwing getters", () => {
  const value = { safe: 1 };
  Object.defineProperty(value, "bad", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });
  expect(readObjectEntries(value)).toEqual([["safe", 1]]);
});

test("bounds the number of readable data entries", () => {
  expect(readObjectEntries({ first: 1, second: 2 }, 1)).toEqual([["first", 1]]);
});

test("excludes named properties before reading their values", () => {
  let invoked = false;
  const value = Object.defineProperty({}, "message", {
    enumerable: true,
    get() {
      invoked = true;
      return "private";
    },
  });
  expect(readObjectEntries(value, Number.POSITIVE_INFINITY, ["message"])).toEqual([]);
  expect(invoked).toBe(false);
});

test("omits non-throwing accessors without invoking them", () => {
  let invoked = false;
  const value = Object.defineProperty({}, "secret", {
    enumerable: true,
    get() {
      invoked = true;
      return "secret-value";
    },
  });
  expect(readObjectEntries(value)).toEqual([]);
  expect(invoked).toBe(false);
});
