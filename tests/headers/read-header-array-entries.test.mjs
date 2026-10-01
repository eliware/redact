import { readHeaderArrayEntries } from "../../src/headers/read-header-array-entries.mjs";

test("keeps only valid entry pairs", () => {
  expect(readHeaderArrayEntries([["accept", "json"], null, ["broken"]])).toEqual([
    ["accept", "json"],
  ]);
});

test("reduces hostile arrays to an empty entry list", () => {
  const headers = new Proxy([], {
    get(_target, key) {
      if (key === "filter") throw Error();
    },
  });
  expect(readHeaderArrayEntries(headers)).toEqual([]);
});
