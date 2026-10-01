import { appendTruncationMarker } from "../../src/limits/append-truncation-marker.mjs";

test("adds truncation metadata using a collision-safe key", () => {
  const output = { __truncated: "source", ___truncated: "also source" };
  expect(appendTruncationMarker(output)).toEqual({
    __truncated: "source",
    ___truncated: "also source",
    ____truncated: "[TRUNCATED]",
  });
});
