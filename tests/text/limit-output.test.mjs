import { limitOutput } from "../../src/text/limit-output.mjs";

test("reserves output space for the truncation marker", () => {
  expect(limitOutput("x".repeat(30), 15)).toBe("xxxx[TRUNCATED]");
});

test("uses an ellipsis or an empty string for small limits", () => {
  expect(limitOutput("long text", 5)).toBe("…");
  expect(limitOutput("long text", 0)).toBe("");
});

test("uses the default output limit for non-finite values", () => {
  expect(limitOutput("x".repeat(10001), Number.NaN)).toHaveLength(10000);
});

test("keeps output within a finite fractional limit", () => {
  expect(limitOutput("x".repeat(30), 15.9)).toHaveLength(15);
});
