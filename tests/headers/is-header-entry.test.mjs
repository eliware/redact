import { isHeaderEntry } from "../../src/headers/is-header-entry.mjs";

test("accepts array entries with a name and value", () => {
  expect(isHeaderEntry(["accept", "json"])).toBe(true);
  expect(isHeaderEntry(["accept", "json", "extra"])).toBe(true);
});

test("rejects malformed and hostile entries", () => {
  expect(isHeaderEntry(null)).toBe(false);
  expect(isHeaderEntry(["accept"])).toBe(false);
  const { proxy, revoke } = Proxy.revocable([], {});
  revoke();
  expect(isHeaderEntry(proxy)).toBe(false);
});
