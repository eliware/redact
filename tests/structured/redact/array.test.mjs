import { redactArray } from "../../../src/structured/redact/array.mjs";
import { normalizePolicy } from "../../../src/policy/normalize-policy.mjs";
import { DEFAULT_LIMITS } from "../../../src/limits/default-limits.mjs";

const redactChild = (value) => value;

test("redacts array indices named by the sensitive-key policy", () => {
  expect(
    redactArray(["secret"], normalizePolicy({ keys: ["0"] }), DEFAULT_LIMITS, redactChild),
  ).toEqual(["[REDACTED]"]);
});

test("preserves sparse holes without reading inherited array values", () => {
  const prototype = Object.create(Array.prototype, {
    0: { value: "inherited-secret", enumerable: true },
  });
  const input = [];
  input.length = 1;
  Object.setPrototypeOf(input, prototype);

  const output = redactArray(input, normalizePolicy(), DEFAULT_LIMITS, redactChild);

  expect(Object.hasOwn(output, 0)).toBe(false);
  expect(0 in output).toBe(false);
});

test("marks array items omitted by maxArray", () => {
  expect(
    redactArray(
      ["first", "second"],
      normalizePolicy(),
      { ...DEFAULT_LIMITS, maxArray: 1 },
      redactChild,
    ),
  ).toEqual(["first", "[TRUNCATED]"]);
});

test("marks retained array items omitted by maxKeys", () => {
  const output = redactArray(
    ["first", "second"],
    normalizePolicy(),
    { ...DEFAULT_LIMITS, maxKeys: 1 },
    redactChild,
  );

  expect(output).toHaveLength(3);
  expect(output[0]).toBe("first");
  expect(Object.hasOwn(output, 1)).toBe(false);
  expect(output[2]).toBe("[TRUNCATED]");
});

test("shares maxKeys between retained indices and extra properties", () => {
  const input = ["first", "second", "third"];
  input.label = "extra";
  const output = redactArray(
    input,
    normalizePolicy(),
    { ...DEFAULT_LIMITS, maxKeys: 2 },
    redactChild,
  );

  expect(output[0]).toBe("first");
  expect(output[1]).toBe("second");
  expect(Object.hasOwn(output, 2)).toBe(false);
  expect(output.label).toBeUndefined();
  expect(output[3]).toBe("[TRUNCATED]");
});

test("does not call overridable array methods", () => {
  const input = ["value"];
  input.slice = () => {
    throw new Error("overridden slice");
  };
  input.map = () => {
    throw new Error("overridden map");
  };

  expect(redactArray(input, normalizePolicy(), DEFAULT_LIMITS, redactChild)).toEqual(["value"]);
});

test("adds the truncation marker without calling an own push property", () => {
  const input = ["retained", "omitted"];
  input.push = "value";

  const output = redactArray(
    input,
    normalizePolicy(),
    { ...DEFAULT_LIMITS, maxArray: 1 },
    redactChild,
  );

  expect(output[0]).toBe("retained");
  expect(output[1]).toBe("[TRUNCATED]");
  expect(output.push).toBe("value");
});

test("returns an empty array when an array item read fails", () => {
  const input = new Proxy(["value"], {
    get(target, key, receiver) {
      if (key === "0") throw new Error("blocked");
      return Reflect.get(target, key, receiver);
    },
  });

  expect(redactArray(input, normalizePolicy(), DEFAULT_LIMITS, redactChild)).toEqual([]);
});

test("keeps retained indices when extra-property enumeration fails", () => {
  const input = new Proxy(["retained"], {
    ownKeys() {
      throw new Error("blocked");
    },
  });

  expect(redactArray(input, normalizePolicy(), DEFAULT_LIMITS, redactChild)).toEqual([
    "retained",
    "[TRUNCATED]",
  ]);
});

test("redacts a sensitive property without reading its getter", () => {
  let reads = 0;
  const input = [];
  Object.defineProperty(input, "token", {
    enumerable: true,
    get() {
      reads++;
      throw new Error("should not read a sensitive value");
    },
  });

  expect(redactArray(input, normalizePolicy(), DEFAULT_LIMITS, redactChild).token).toBe(
    "[REDACTED]",
  );
  expect(reads).toBe(0);
});

test("does not read an omitted sensitive getter when maxKeys is exhausted", () => {
  let reads = 0;
  const input = [];
  Object.defineProperty(input, "token", {
    enumerable: true,
    get() {
      reads++;
      throw new Error("should not read an omitted value");
    },
  });

  expect(
    redactArray(input, normalizePolicy(), { ...DEFAULT_LIMITS, maxKeys: 0 }, redactChild),
  ).toEqual(["[TRUNCATED]"]);
  expect(reads).toBe(0);
});
