import { readHeaderEntries } from "../../src/headers/header-entry-reader.mjs";

test("reads object, iterable, and entry-array headers", () => {
  expect(readHeaderEntries({ a: "1" })).toEqual([["a", "1"]]);
  expect(readHeaderEntries([["a", "1"]])).toEqual([["a", "1"]]);
  expect(readHeaderEntries(new Headers({ a: "1" }))).toEqual([["a", "1"]]);
});

test("handles hostile input shape checks", () => {
  const { proxy, revoke } = Proxy.revocable([], {});
  revoke();
  expect(readHeaderEntries(proxy)).toEqual([]);
  const headers = Object.defineProperty({}, "entries", {
    get() {
      throw new Error("blocked");
    },
  });
  expect(readHeaderEntries(headers)).toEqual([]);
});
