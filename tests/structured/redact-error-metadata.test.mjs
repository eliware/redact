import { redactErrorMetadata } from "../../src/structured/redact-error-metadata.mjs";

test("redacts enumerable Error metadata separately from standard fields", () => {
  expect(
    redactErrorMetadata(
      Object.assign(new Error("failed"), { token: "secret", safe: "value" }),
      { keys: new Set(["token"]), marker: "[x]" },
      (value) => value,
    ),
  ).toEqual([
    ["token", "[x]"],
    ["safe", "value"],
  ]);
});
