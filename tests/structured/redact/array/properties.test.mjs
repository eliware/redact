import { redactArrayProperties } from "../../../../src/structured/redact/array/properties.mjs";
import { normalizePolicy } from "../../../../src/policy/normalize-policy.mjs";
import { DEFAULT_LIMITS } from "../../../../src/limits/default-limits.mjs";

test("redacts sensitive extra properties and copies safe properties", () => {
  const input = ["index"];
  input.token = "secret";
  input.label = "visible";
  const output = [];

  const result = redactArrayProperties(
    input,
    output,
    normalizePolicy(),
    DEFAULT_LIMITS,
    0,
    (value) => value,
  );

  expect(output.token).toBe("[REDACTED]");
  expect(output.label).toBe("visible");
  expect(output[0]).toBeUndefined();
  expect(result.truncated).toBe(false);
});

test("skips properties that disappear during inspection", () => {
  const input = new Proxy([], {
    ownKeys: () => ["extra", "length"],
    getOwnPropertyDescriptor(target, key) {
      if (key === "extra") return undefined;
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
  });

  const output = [];
  const result = redactArrayProperties(
    input,
    output,
    normalizePolicy(),
    DEFAULT_LIMITS,
    0,
    (value) => value,
  );

  expect(output).toEqual([]);
  expect(result.truncated).toBe(false);
});

test("omits non-sensitive function properties", () => {
  const input = [];
  input.method = () => {};
  const output = [];

  redactArrayProperties(input, output, normalizePolicy(), DEFAULT_LIMITS, 0, (value) => value);

  expect(output).toEqual([]);
});

test("omits non-enumerable properties without marking output truncated", () => {
  const input = [];
  Object.defineProperty(input, "hidden", { value: "private" });
  const output = [];

  const result = redactArrayProperties(
    input,
    output,
    normalizePolicy(),
    DEFAULT_LIMITS,
    0,
    (value) => value,
  );

  expect(output).toEqual([]);
  expect(result.truncated).toBe(false);
});

test("omits non-sensitive getter properties that return functions", () => {
  const input = [];
  Object.defineProperty(input, "method", {
    enumerable: true,
    get() {
      return () => {};
    },
  });
  const output = [];

  redactArrayProperties(input, output, normalizePolicy(), DEFAULT_LIMITS, 0, (value) => value);

  expect(output).toEqual([]);
});

test("retains later values when a getter returns an omitted function", () => {
  const input = [];
  Object.defineProperty(input, "method", {
    enumerable: true,
    get() {
      return () => {};
    },
  });
  input.label = "visible";
  const output = [];
  const limits = { ...DEFAULT_LIMITS, maxKeys: 1 };

  const result = redactArrayProperties(
    input,
    output,
    normalizePolicy(),
    limits,
    0,
    (value) => value,
  );

  expect(output.label).toBe("visible");
  expect(result.truncated).toBe(false);
});

test("copies a getter value once when it returns a non-function", () => {
  let reads = 0;
  const input = [];
  Object.defineProperty(input, "label", {
    enumerable: true,
    get() {
      reads++;
      return "visible";
    },
  });
  const output = [];

  redactArrayProperties(input, output, normalizePolicy(), DEFAULT_LIMITS, 0, (value) => value);

  expect(output.label).toBe("visible");
  expect(reads).toBe(1);
});

test("uses the inspected data value without reading through a proxy", () => {
  const input = new Proxy([], {
    get(target, key, receiver) {
      if (key === "label") return "uninspected";
      return Reflect.get(target, key, receiver);
    },
  });
  input.label = "inspected";
  const output = [];

  redactArrayProperties(input, output, normalizePolicy(), DEFAULT_LIMITS, 0, (value) => value);

  expect(output.label).toBe("inspected");
});

test("marks an accessor omitted by a zero key limit without reading it", () => {
  const input = [];
  Object.defineProperty(input, "label", {
    enumerable: true,
    get() {
      throw new Error("should not read an omitted value");
    },
  });

  const result = redactArrayProperties(
    input,
    [],
    normalizePolicy(),
    { ...DEFAULT_LIMITS, maxKeys: 0 },
    0,
    (value) => value,
  );

  expect(result.truncated).toBe(true);
});

test("shares maxKeys between array items and extra properties", () => {
  const input = ["item"];
  input.label = "extra";
  const output = ["item"];
  const limits = { ...DEFAULT_LIMITS, maxKeys: 1 };

  const result = redactArrayProperties(
    input,
    output,
    normalizePolicy(),
    limits,
    1,
    (value) => value,
  );

  expect(output).toEqual(["item"]);
  expect(result.truncated).toBe(true);
});

test("retains sensitive markers after the value-read limit is reached", () => {
  const input = [];
  input.token = "secret";
  const output = [];

  const result = redactArrayProperties(
    input,
    output,
    normalizePolicy(),
    { ...DEFAULT_LIMITS, maxKeys: 0 },
    0,
    (value) => value,
  );

  expect(output.token).toBe("[REDACTED]");
  expect(result.truncated).toBe(false);
});

test("marks extra properties omitted by maxKeys", () => {
  const input = [];
  input.first = "one";
  input.second = "two";
  const output = [];
  const limits = { ...DEFAULT_LIMITS, maxKeys: 1 };

  const result = redactArrayProperties(
    input,
    output,
    normalizePolicy(),
    limits,
    0,
    (value) => value,
  );

  expect(output.length).toBe(0);
  expect(output.first).toBe("one");
  expect(result.truncated).toBe(true);
});

test("returns a failure through the caller when an extra property read throws", () => {
  const input = [];
  Object.defineProperty(input, "blocked", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });

  expect(() =>
    redactArrayProperties(input, [], normalizePolicy(), DEFAULT_LIMITS, 0, (value) => value),
  ).toThrow("blocked");
});

test("marks extra properties truncated when key enumeration fails", () => {
  const input = new Proxy([], {
    ownKeys() {
      throw new Error("blocked");
    },
  });

  expect(
    redactArrayProperties(input, [], normalizePolicy(), DEFAULT_LIMITS, 0, (value) => value),
  ).toEqual({ truncated: true });
});

test("marks extra properties truncated when descriptor inspection fails", () => {
  const target = [];
  target.label = "visible";
  let reads = 0;
  const input = new Proxy(target, {
    getOwnPropertyDescriptor(object, key) {
      if (key === "label" && ++reads > 0) throw new Error("blocked");
      return Reflect.getOwnPropertyDescriptor(object, key);
    },
  });

  expect(
    redactArrayProperties(input, [], normalizePolicy(), DEFAULT_LIMITS, 0, (value) => value),
  ).toEqual({ truncated: true });
});
