import { serializeErrorMetadata } from "../../src/serialization/serialize-error-metadata.mjs";

test("serializes enumerable Error metadata and redacts sensitive keys", () => {
  const error = Object.assign(new Error("failed"), { token: "secret", detail: "info" });
  expect(
    serializeErrorMetadata(
      error,
      { keys: new Set(["token"]), marker: "[REDACTED]" },
      (value) => value,
      0,
      10,
    ),
  ).toEqual([
    ["token", "[REDACTED]"],
    ["detail", "info"],
  ]);
});

test("redacts mixed-case Error metadata keys", () => {
  const error = Object.assign(new Error("failed"), { Token: "secret" });
  expect(
    serializeErrorMetadata(
      error,
      { keys: new Set(["token"]), marker: "[REDACTED]" },
      (value) => value,
      0,
      10,
    ),
  ).toEqual([["Token", "[REDACTED]"]]);
});

test("bounds enumerable Error metadata and emits one truncation marker", () => {
  const error = Object.assign(new Error("failed"), { first: 1, second: 2 });
  expect(
    serializeErrorMetadata(
      error,
      { keys: new Set(), marker: "[REDACTED]" },
      (value) => value,
      0,
      1,
    ),
  ).toEqual([
    ["first", 1],
    ["__truncated", "[TRUNCATED]"],
  ]);
});
