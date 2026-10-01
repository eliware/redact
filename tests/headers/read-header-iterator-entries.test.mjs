import { readHeaderIteratorEntries } from "../../src/headers/read-header-iterator-entries.mjs";

test("reads valid entries and skips malformed entries", () => {
  const headers = {
    *entries() {
      yield ["accept", "json"];
      yield null;
      yield ["authorization"];
      yield ["content-type", "text/plain"];
    },
  };
  expect(readHeaderIteratorEntries(headers)).toEqual([
    ["accept", "json"],
    ["content-type", "text/plain"],
  ]);
});

test("bounds iterator consumption and handles iterator failures", () => {
  let consumed = 0;
  const large = {
    *entries() {
      while (true) yield [`x-${++consumed}`, "value"];
    },
  };
  expect(readHeaderIteratorEntries(large)).toHaveLength(1000);
  expect(consumed).toBe(1000);
  expect(
    readHeaderIteratorEntries({
      entries() {
        throw Error();
      },
    }),
  ).toEqual([]);
});
