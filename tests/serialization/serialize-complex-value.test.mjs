import { serializeComplexValue } from "../../src/serialization/serialize-complex-value.mjs";

test("serializes buffers, arrays, Errors, and object properties", () => {
  const serialize = (value) => value;
  const policy = { keys: new Set(["token"]), marker: "[REDACTED]" };
  expect(serializeComplexValue(Buffer.from("a"), policy, {}, new WeakSet(), 0, serialize)).toBe(
    "[Buffer length=1]",
  );
  expect(serializeComplexValue([1], policy, { maxArray: 2 }, new WeakSet(), 0, serialize)).toEqual([
    1,
  ]);
  expect(
    serializeComplexValue({ token: "secret" }, policy, { maxKeys: 2 }, new WeakSet(), 0, serialize),
  ).toMatchObject({ token: "[REDACTED]" });
  expect(
    serializeComplexValue(
      Object.assign(new Error("failed"), { token: "secret" }),
      policy,
      { maxKeys: 2 },
      new WeakSet(),
      0,
      serialize,
    ),
  ).toMatchObject({ message: "failed", token: "[REDACTED]" });
});
