import { redactArray } from "../../src/structured/redact-array.mjs";
import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";
import { DEFAULT_LIMITS } from "../../src/limits/default-limits.mjs";

test("redacts sensitive non-index array properties", () => {
  const input = [];
  input.token = "secret";
  const output = redactArray(input, normalizePolicy(), DEFAULT_LIMITS, (value) => value);

  expect(output.token).toBe("[REDACTED]");
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
