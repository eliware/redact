import { redactArray } from "../../../src/structured/redact/array.mjs";
import { normalizePolicy } from "../../../src/policy/normalize-policy.mjs";
import { DEFAULT_LIMITS } from "../../../src/limits/default-limits.mjs";

test("redacts sensitive non-index array properties", () => {
  const input = [];
  input.token = "secret";
  const output = redactArray(input, normalizePolicy(), DEFAULT_LIMITS, (value) => value);

  expect(output.token).toBe("[REDACTED]");
});

test("redacts array indices named by the sensitive-key policy", () => {
  const input = ["secret"];
  const output = redactArray(
    input,
    normalizePolicy({ keys: ["0"] }),
    DEFAULT_LIMITS,
    (value) => value,
  );

  expect(output[0]).toBe("[REDACTED]");
});

test("copies safe non-index array properties", () => {
  const input = [];
  input.label = "visible";
  const output = redactArray(input, normalizePolicy(), DEFAULT_LIMITS, (value) => value);

  expect(output.label).toBe("visible");
});

test("skips array properties that disappear during inspection", () => {
  let reads = 0;
  const input = new Proxy([], {
    ownKeys: () => ["extra", "length"],
    getOwnPropertyDescriptor(target, key) {
      if (key === "extra" && ++reads > 1) return undefined;
      if (key === "extra") return { configurable: true, enumerable: true, value: "value" };
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
  });
  const output = redactArray(input, normalizePolicy(), DEFAULT_LIMITS, (value) => value);

  expect(output).toEqual([]);
});

test("marks non-index array properties omitted by maxKeys", () => {
  const input = [];
  input.safe = "value";
  const limits = { ...DEFAULT_LIMITS, maxKeys: 0 };
  const output = redactArray(input, normalizePolicy(), limits, (value) => value);

  expect(output).toEqual(["[TRUNCATED]"]);
});

test("applies maxKeys to array items and extra properties together", () => {
  const input = ["item"];
  input.label = "extra";
  const limits = { ...DEFAULT_LIMITS, maxKeys: 1 };
  const output = redactArray(input, normalizePolicy(), limits, (value) => value);

  expect(output[0]).toBe("item");
  expect(Object.hasOwn(output, "label")).toBe(false);
  expect(output[1]).toBe("[TRUNCATED]");
});

test("marks array items omitted by the shared maxKeys limit", () => {
  const input = ["first", "second"];
  const limits = { ...DEFAULT_LIMITS, maxKeys: 1 };
  const output = redactArray(input, normalizePolicy(), limits, (value) => value);

  expect(output[0]).toBe("first");
  expect(output[2]).toBe("[TRUNCATED]");
});

test("returns an empty array when a retained item read fails", () => {
  const input = [];
  Object.defineProperty(input, "0", {
    enumerable: true,
    configurable: true,
    get() {
      throw new Error("blocked");
    },
  });
  const output = redactArray(input, normalizePolicy(), DEFAULT_LIMITS, (value) => value);

  expect(output).toEqual([]);
});

test("returns an empty array when an extra property read fails", () => {
  const input = ["item"];
  Object.defineProperty(input, "extra", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });
  const output = redactArray(input, normalizePolicy(), DEFAULT_LIMITS, (value) => value);

  expect(output).toEqual([]);
});

test("adds a truncation marker when an own push property shadows the method", () => {
  const input = ["retained", "omitted"];
  input.push = "value";
  const limits = { ...DEFAULT_LIMITS, maxArray: 1 };
  const output = redactArray(input, normalizePolicy(), limits, (value) => value);

  expect(output[0]).toBe("retained");
  expect(output[1]).toBe("[TRUNCATED]");
  expect(output.push).toBe("value");
});
