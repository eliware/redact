import { safeSerialize } from "../../src/serialization/safe-serialize.mjs";

test("serializes and redacts structured values", () => {
  expect(safeSerialize({ token: "secret", nested: { id: 2 }, big: 2n })).toEqual({
    token: "[REDACTED]",
    nested: { id: 2 },
    big: "2n",
  });
  expect(safeSerialize("token=secret")).toBe("token=[REDACTED]");
});

test("handles cycles, arrays, functions, symbols, and buffers", () => {
  const value = { fn() {}, symbol: Symbol("x"), buffer: Buffer.from("abc") };
  value.self = value;
  expect(safeSerialize(value)).toMatchObject({
    fn: "[Function: fn]",
    symbol: "[Symbol: x]",
    buffer: "[Buffer length=3]",
    self: "[CIRCULAR]",
  });
  expect(safeSerialize([1, 2, 3], { maxArray: 2 })).toEqual([1, 2, "[TRUNCATED]"]);
});

test("enforces depth, key, string, and circular limits", () => {
  expect(safeSerialize({ deep: { value: 1 } }, { maxDepth: 0 }).deep).toBe("[TRUNCATED]");
  expect(safeSerialize({ a: 1, b: 2 }, { maxKeys: 1 })).toEqual({
    a: 1,
    __truncated: "[TRUNCATED]",
  });
  expect(safeSerialize("abcdef", { maxString: 3 })).toBe("abc");
  const value = {};
  value.self = value;
  expect(safeSerialize(value, { circularMarker: "<cycle>" }).self).toBe("[CIRCULAR]");
});

test("serializes indexed array items and omits named array properties", () => {
  const value = ["item"];
  value.token = "secret";
  expect(safeSerialize(value)).toEqual(["item"]);
});

test("replaces configured literal secrets in nested string values", () => {
  expect(safeSerialize({ value: "known-secret" }, { secrets: ["known-secret"] })).toEqual({
    value: "[REDACTED]",
  });
});

test("reuses literal secrets from one-shot iterables across string values", () => {
  const secrets = (function* () {
    yield "known-secret";
  })();
  expect(safeSerialize({ first: "known-secret", second: "known-secret" }, { secrets })).toEqual({
    first: "[REDACTED]",
    second: "[REDACTED]",
  });
});

test("redacts literal secrets and credential patterns in Error string fields", () => {
  const error = new Error("token=secret");
  error.name = "known-secret";
  error.stack = "stack known-secret";
  expect(safeSerialize(error, { secrets: ["known-secret"] })).toMatchObject({
    name: "[REDACTED]",
    message: "token=[REDACTED]",
    stack: "stack [REDACTED]",
  });
});

test("handles errors and hostile values safely", () => {
  const error = Object.assign(new Error("failed"), {
    token: "secret",
    extra: true,
  });
  expect(safeSerialize(error)).toMatchObject({
    name: "Error",
    message: "failed",
    token: "[REDACTED]",
  });
  expect(
    safeSerialize(
      new Proxy(
        {},
        {
          ownKeys() {
            throw new Error("blocked");
          },
        },
      ),
    ),
  ).toEqual({});
  expect(() =>
    safeSerialize({
      get bad() {
        throw new Error("blocked");
      },
    }),
  ).not.toThrow();
  expect(
    safeSerialize(
      Object.assign(new Error("failed"), {
        stack: "",
        name: "Named",
        message: "changed",
      }),
    ),
  ).toMatchObject({ name: "Named", message: "changed" });
  expect(safeSerialize(new Error("failed"), { keys: ["message", "stack"] })).toMatchObject({
    message: "[REDACTED]",
    stack: "[REDACTED]",
  });
});
