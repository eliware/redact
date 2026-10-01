import { validateHeaderNames } from "../../src/headers/validate-header-names.mjs";

test("accepts iterable and omitted header-name options", () => {
  expect(() => validateHeaderNames(["authorization"])).not.toThrow();
  expect(() => validateHeaderNames()).not.toThrow();
});

test("rejects strings and non-iterable header-name options", () => {
  expect(() => validateHeaderNames("authorization")).toThrow("headerNames must be iterable");
  expect(() => validateHeaderNames(42)).toThrow("headerNames must be iterable");
});
