import { safeSerialize } from "../../src/serialization/safe-serialize.mjs";

test("serializes primitives and redacts nested keys", () => {
  expect(safeSerialize({ token: "secret", nested: { id: 2 }, big: 2n })).toEqual({
    token: "[REDACTED]",
    nested: { id: 2 },
    big: "2n",
  });
});

test("handles complex values and limits", () => {
  const value = {
    buffer: Buffer.from("abc"),
    error: Object.assign(new Error("failed"), { token: "secret" }),
  };
  value.self = value;
  expect(safeSerialize(value, { maxString: 3 })).toMatchObject({
    buffer: "[Buffer length=3]",
    error: {
      name: "Err...[TRUNCATED]",
      message: "fai...[TRUNCATED]",
      token: "[REDACTED]",
    },
    self: "[CIRCULAR]",
  });
  expect(safeSerialize({ deep: { value: 1 } }, { maxDepth: 0 }).deep).toBe("[TRUNCATED]");
  expect(safeSerialize([1, { token: "secret" }])).toEqual([1, { token: "[REDACTED]" }]);
});

test("coordinates depth, key, and array limits", () => {
  expect(safeSerialize({ a: 1, b: 2 }, { maxKeys: 1 }).__truncated).toBe("[TRUNCATED]");
  expect(safeSerialize([1, 2], { maxArray: 1 })).toEqual([1]);
  expect(safeSerialize({ deep: { value: 1 } }, { maxDepth: 0 }).deep).toBe("[TRUNCATED]");
});

test("returns a safe fallback when a special object throws during serialization", () => {
  expect(
    safeSerialize(
      new Proxy(new Error("blocked"), {
        get(target, key) {
          if (key === "name") throw new Error("blocked");
          return Reflect.get(target, key);
        },
      }),
    ),
  ).toBe("[UNSERIALIZABLE]");
});
