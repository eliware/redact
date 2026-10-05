import { addTruncationMarker } from "../../src/inspection/add-truncation-marker.mjs";

test("adds the default truncation marker when its key is available", () => {
  const output = {};
  addTruncationMarker(output);
  expect(output).toEqual({ __truncated: "[TRUNCATED]" });
});

test("uses the first available suffixed marker key", () => {
  const output = { __truncated: "retained", __truncated_1: "also retained" };
  addTruncationMarker(output);
  expect(output).toEqual({
    __truncated: "retained",
    __truncated_1: "also retained",
    __truncated_2: "[TRUNCATED]",
  });
});
