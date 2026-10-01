import { readHeaderEntries } from "../../src/headers/header-entry-reader.mjs";

test("reads object, iterable, and entry-array headers", () => {
  expect(readHeaderEntries({ a: "1" })).toEqual([["a", "1"]]);
  expect(readHeaderEntries([["a", "1"]])).toEqual([["a", "1"]]);
  expect(readHeaderEntries(new Headers({ a: "1" }))).toEqual([["a", "1"]]);
});

test("skips malformed entries from Headers-style iterators", () => {
  const { proxy, revoke } = Proxy.revocable([], {});
  revoke();
  const headers = {
    *entries() {
      yield ["accept", "json"];
      yield null;
      yield "invalid";
      yield proxy;
      yield ["authorization"];
      yield ["content-type", "text/plain"];
    },
  };
  expect(readHeaderEntries(headers)).toEqual([
    ["accept", "json"],
    ["content-type", "text/plain"],
  ]);
});
