import { serializeErrorStandardFields } from "../../src/serialization/serialize-error-standard-fields.mjs";

test("serializes and redacts standard Error fields", () => {
  const error = Object.assign(new Error("failed"), { name: "RequestError", stack: "trace" });
  const serialize = (value, depth) => `${depth}:${value}`;
  expect(
    serializeErrorStandardFields(error, { keys: new Set(), marker: "[REDACTED]" }, serialize, 1),
  ).toEqual({
    name: "2:RequestError",
    message: "2:failed",
    stack: "2:trace",
  });
});

test("replaces configured standard fields with the fixed marker", () => {
  expect(
    serializeErrorStandardFields(
      new Error("failed"),
      { keys: new Set(["message", "stack"]), marker: "[REDACTED]" },
      (value) => value,
      0,
    ),
  ).toMatchObject({ message: "[REDACTED]", stack: "[REDACTED]" });
});
