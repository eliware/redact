import { redactArray } from "../../src/structured/redact-array.mjs";

test("redacts array children through the callback", () =>
  expect(redactArray([1, 2], { keys: new Set(), marker: "[x]" }, (value) => value * 2)).toEqual([
    2, 4,
  ]));

test("truncates arrays past the configured limit", () => {
  expect(
    redactArray([1, 2, 3], { keys: new Set(), marker: "[x]", maxArray: 2 }, (value) => value),
  ).toEqual([1, 2, "[TRUNCATED]"]);
});

test("returns a safe result when hostile array length access throws", () => {
  const value = new Proxy([1], {
    get(target, key, receiver) {
      if (key === "length") throw new Error("blocked");
      return Reflect.get(target, key, receiver);
    },
  });
  expect(redactArray(value, { keys: new Set() }, (item) => item)).toEqual([]);
});

test("returns empty output when bounded selection fails", () => {
  const value = new Proxy([1], {
    get(target, key, receiver) {
      if (key === "slice") throw new Error("blocked");
      return Reflect.get(target, key, receiver);
    },
  });
  expect(redactArray(value, { keys: new Set(), maxArray: 1 }, (item) => item)).toEqual([]);
});
