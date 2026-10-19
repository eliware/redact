import { safeSerialize } from "../../src/serialization/safe-serialize.mjs";

test("serializes primitives and redacts nested keys", () => {
  expect(safeSerialize({ token: "secret", nested: { id: 2 }, big: 2n })).toEqual({
    token: "[REDACTED]",
    nested: { id: 2 },
    big: "2n",
  });
});

test("serializes arrays without calling their overridable methods", () => {
  const input = [1, 2];
  input.slice = () => {
    throw new Error("overridden slice");
  };
  input.map = () => {
    throw new Error("overridden map");
  };

  expect(safeSerialize(input)).toEqual([1, 2]);
});

test("does not serialize inherited numeric values from sparse arrays", () => {
  const prototype = Object.create(Array.prototype, {
    0: { value: "inherited-secret", enumerable: true },
  });
  const input = [];
  input.length = 1;
  Object.setPrototypeOf(input, prototype);

  const output = safeSerialize(input);
  expect(output).toHaveLength(1);
  expect(Object.hasOwn(output, 0)).toBe(false);
  expect(0 in output).toBe(false);
});

test("omits enumerable symbol keys from the string-keyed serialization", () => {
  const secretKey = Symbol("token");
  const input = { visible: "value", [secretKey]: "secret" };

  expect(safeSerialize(input)).toEqual({ visible: "value" });
});

test("preserves an own __proto__ key as serialized data", () => {
  const input = {};
  Object.defineProperty(input, "__proto__", { value: { visible: "value" }, enumerable: true });

  const output = safeSerialize(input);
  expect(Object.hasOwn(output, "__proto__")).toBe(true);
  expect(output.__proto__).toEqual({ visible: "value" });
  expect(Object.getPrototypeOf(output)).toBe(Object.prototype);
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
      name: "…",
      message: "…",
      token: "[REDACTED]",
    },
    self: "[CIRCULAR]",
  });
  expect(safeSerialize({ deep: { value: 1 } }, { maxDepth: 0 }).deep).toBe("[TRUNCATED]");
  expect(safeSerialize([1, { token: "secret" }])).toEqual([1, { token: "[REDACTED]" }]);
});

test("coordinates depth, key, and array limits", () => {
  expect(safeSerialize({ a: 1, b: 2 }, { maxKeys: 1 }).__truncated).toBe("[TRUNCATED]");
  expect(safeSerialize([1, 2], { maxArray: 1 })).toEqual([1, "[TRUNCATED]"]);
  expect(safeSerialize({ deep: { value: 1 } }, { maxDepth: 0 }).deep).toBe("[TRUNCATED]");
});

test("truncates primitive children beyond the depth limit", () => {
  expect(safeSerialize({ value: "visible" }, { maxDepth: 0 })).toEqual({ value: "[TRUNCATED]" });
});

test("counts Error standard fields as children for maxDepth", () => {
  const error = new Error();
  error.name = { nested: "name" };
  error.message = { nested: "message" };
  error.stack = { nested: "stack" };

  expect(safeSerialize(error, { maxDepth: 0 })).toMatchObject({
    name: "[TRUNCATED]",
    message: "[TRUNCATED]",
    stack: "[TRUNCATED]",
  });
});

test("bounds non-enumerable standard Error fields with maxKeys", () => {
  expect(safeSerialize(new Error("failed"), { maxKeys: 0 })).toEqual({
    __truncated: "[TRUNCATED]",
  });
});

test("normalizes fractional key and array limits", () => {
  expect(safeSerialize({ first: 1, second: 2 }, { maxKeys: 1.9 })).toEqual({
    first: 1,
    __truncated: "[TRUNCATED]",
  });
  expect(safeSerialize([1, 2, 3], { maxArray: 1.9 })).toEqual([1, "[TRUNCATED]"]);
});

test.each([Infinity, -Infinity, Number.NaN])(
  "normalizes non-finite maxDepth %s to the finite default",
  (maxDepth) => {
    let input = { leaf: true };
    for (let index = 0; index < 30; index++) input = { child: input };

    let output = safeSerialize(input, { maxDepth });
    for (let index = 0; index < 20; index++) output = output.child;
    expect(output.child).toBe("[TRUNCATED]");
  },
);

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

test("returns the unserializable fallback when an array item cannot be read", () => {
  const input = new Proxy([1], {
    get(target, key, receiver) {
      if (key === "0") throw new Error("blocked");
      return Reflect.get(target, key, receiver);
    },
  });

  expect(safeSerialize(input)).toBe("[UNSERIALIZABLE]");
});

test("returns an empty object when an enumerable getter prevents complete serialization", () => {
  const input = { visible: "safe" };
  Object.defineProperty(input, "blocked", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });

  expect(safeSerialize(input)).toEqual({});
});
