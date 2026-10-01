import { selectBoundedArray } from "../../src/structured/select-bounded-array.mjs";

test("selects bounded array items and reports truncation", () => {
  expect(selectBoundedArray([1, 2, 3], 2)).toEqual({ items: [1, 2], truncated: true });
  expect(selectBoundedArray([1, 2], 2)).toEqual({ items: [1, 2], truncated: false });
});

test("rejects invalid bounds and safely handles hostile arrays", () => {
  expect(() => selectBoundedArray([], -1)).toThrow("maxArray must be a non-negative integer");
  const hostile = new Proxy([1], {
    get(_target, key) {
      if (key === "slice") throw Error();
    },
  });
  expect(selectBoundedArray(hostile, 1)).toBeNull();
});

test("rejects a hostile slice result that is not an array", () => {
  const hostile = new Proxy([1], {
    get(_target, key) {
      return key === "slice" ? () => ({}) : [1][key];
    },
  });
  expect(selectBoundedArray(hostile, 1)).toBeNull();
});
