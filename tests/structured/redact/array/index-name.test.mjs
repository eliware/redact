import { isArrayIndexName } from "../../../../src/structured/redact/array/index-name.mjs";

test.each([
  ["0", 1, true],
  ["1", 1, false],
  ["01", 2, false],
  ["-1", 2, false],
  ["1.5", 2, false],
  ["4294967295", 4294967296, false],
])("classifies %s for array length %i", (key, length, expected) => {
  expect(isArrayIndexName(key, length)).toBe(expected);
});
