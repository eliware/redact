import { matchSecretRanges } from "../../../src/text/replace-literal/matches.mjs";

test("merges overlapping secret ranges", () => {
  expect(matchSecretRanges("abcde", ["abc", "bcde"])).toEqual([[0, 5]]);
});

test("keeps adjacent secret ranges separate", () => {
  expect(matchSecretRanges("firstsecond", ["first", "second"])).toEqual([
    [0, 5],
    [5, 11],
  ]);
});

test("finds the longest match at each position", () => {
  expect(matchSecretRanges("abcdef", ["abc", "abcdef"])).toEqual([[0, 6]]);
});

test("returns no ranges when no non-empty secret matches", () => {
  expect(matchSecretRanges("safe", ["", "absent"])).toEqual([]);
});
