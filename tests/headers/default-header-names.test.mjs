import { DEFAULT_HEADER_NAMES } from "../../src/headers/default-header-names.mjs";

test("exports the frozen built-in sensitive header names", () => {
  expect(DEFAULT_HEADER_NAMES).toContain("authorization");
  expect(Object.isFrozen(DEFAULT_HEADER_NAMES)).toBe(true);
});
