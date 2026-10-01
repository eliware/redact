import { readHeaderObjectEntries } from "../../src/headers/read-header-object-entries.mjs";

test("reads enumerable string-keyed object entries", () => {
  expect(readHeaderObjectEntries({ accept: "json" })).toEqual([["accept", "json"]]);
});

test("handles hostile object enumeration", () => {
  const headers = new Proxy(
    {},
    {
      ownKeys() {
        throw Error();
      },
    },
  );
  expect(readHeaderObjectEntries(headers)).toEqual([]);
});
