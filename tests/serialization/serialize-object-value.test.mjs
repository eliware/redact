import { serializeObjectValue } from "../../src/serialization/serialize-object-value.mjs";

test("bounds object data and redacts sensitive property keys", () => {
  const output = serializeObjectValue(
    { token: "secret", safe: 1, extra: true },
    { keys: new Set(["token"]), marker: "[REDACTED]" },
    { maxKeys: 2 },
    new WeakSet(),
    0,
    (value) => value,
  );
  expect(output).toEqual({ token: "[REDACTED]", safe: 1, __truncated: "[TRUNCATED]" });
});
