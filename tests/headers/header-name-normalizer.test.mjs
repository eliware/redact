import { normalizeHeaderNames } from "../../src/headers/header-name-normalizer.mjs";

test("normalizes default and custom header names", () => {
  expect([...normalizeHeaderNames(["X-CUSTOM"])]).toContain("x-custom");
  expect([...normalizeHeaderNames()]).toContain("authorization");
});
