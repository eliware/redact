import { normalizePolicy } from "../../../src/policy/normalize-policy.mjs";
import { DEFAULT_LIMITS } from "../../../src/limits/default-limits.mjs";
import { serializeError } from "../../../src/serialization/serialize/error.mjs";

test("serializes error fields and redacts sensitive properties", () => {
  const error = Object.assign(new Error("failed"), {
    stack: "",
    name: "CustomError",
    token: "secret",
    detail: "safe",
  });
  const policy = normalizePolicy({ keys: ["message", "token"] });
  const serialize = (value) => value;
  const output = serializeError(error, policy, DEFAULT_LIMITS, new WeakSet(), 0, serialize);

  expect(output).toEqual({
    name: "CustomError",
    message: "[REDACTED]",
    token: "[REDACTED]",
    detail: "safe",
  });
});

test("serializes stack and delegates safe property values", () => {
  const error = Object.assign(new Error("failed"), { detail: { safe: true } });
  const policy = normalizePolicy();
  const serialize = (value) => (typeof value === "string" ? `serialized:${value}` : value);
  const output = serializeError(error, policy, DEFAULT_LIMITS, new WeakSet(), 0, serialize);

  expect(output.name).toBe("serialized:Error");
  expect(output.message).toBe("serialized:failed");
  expect(output.stack).toContain("serialized:Error: failed");
  expect(output.detail).toEqual({ safe: true });
});

test("applies configured sensitive keys to Error name and stack", () => {
  const error = Object.assign(new Error("message"), {
    name: "sensitive name",
    stack: "sensitive stack",
  });
  const policy = normalizePolicy({ keys: ["NAME", "STACK"] });
  const output = serializeError(error, policy, DEFAULT_LIMITS, new WeakSet(), 0, (value) => value);

  expect(output).toMatchObject({
    name: "[REDACTED]",
    stack: "[REDACTED]",
  });
});

test("returns an empty object when a custom Error property cannot be read", () => {
  const error = new Error("failed");
  Object.defineProperty(error, "blocked", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });

  expect(
    serializeError(error, normalizePolicy(), DEFAULT_LIMITS, new WeakSet(), 0, (value) => value),
  ).toEqual({});
});

test("marks omitted custom Error properties after the maxKeys bound", () => {
  const error = Object.assign(new Error("failed"), { first: 1, second: 2 });
  const limits = { ...DEFAULT_LIMITS, maxKeys: 1 };

  expect(
    serializeError(error, normalizePolicy(), limits, new WeakSet(), 0, (value) => value),
  ).toMatchObject({ first: 1, __truncated: "[TRUNCATED]" });
});

test("counts enumerable standard Error fields against maxKeys and reads them once", () => {
  const error = new Error("failed");
  const reads = { name: 0, message: 0, stack: 0 };
  for (const [key, value] of Object.entries({
    name: "CustomError",
    message: "failed",
    stack: "stack",
    extra: "omitted",
  }))
    Object.defineProperty(error, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (key in reads) reads[key]++;
        return value;
      },
    });
  const limits = { ...DEFAULT_LIMITS, maxKeys: 3 };

  expect(
    serializeError(error, normalizePolicy(), limits, new WeakSet(), 0, (value) => value),
  ).toEqual({
    name: "CustomError",
    message: "failed",
    stack: "stack",
    __truncated: "[TRUNCATED]",
  });
  expect(reads).toEqual({ name: 1, message: 1, stack: 1 });

  reads.name = 0;
  reads.message = 0;
  reads.stack = 0;
  expect(
    serializeError(
      error,
      normalizePolicy(),
      { ...limits, maxKeys: 2 },
      new WeakSet(),
      0,
      (value) => value,
    ),
  ).toEqual({
    message: "failed",
    stack: "stack",
    __truncated: "[TRUNCATED]",
  });
  expect(reads).toEqual({ name: 0, message: 1, stack: 1 });
});

test("preserves an own __proto__ Error property as data", () => {
  const error = new Error("failed");
  Object.defineProperty(error, "__proto__", { value: { visible: "value" }, enumerable: true });
  const output = serializeError(
    error,
    normalizePolicy(),
    DEFAULT_LIMITS,
    new WeakSet(),
    0,
    (value) => value,
  );

  expect(Object.hasOwn(output, "__proto__")).toBe(true);
  expect(output.__proto__).toEqual({ visible: "value" });
  expect(Object.getPrototypeOf(output)).toBe(Object.prototype);
});
