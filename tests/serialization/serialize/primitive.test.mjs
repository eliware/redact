import { serializePrimitive } from "../../../src/serialization/serialize/primitive.mjs";

test("represents primitive values for safe serialization", () => {
  expect(serializePrimitive(null, 10)).toBeNull();
  expect(serializePrimitive(undefined, 10)).toBe("[Undefined]");
  expect(serializePrimitive(3, 10)).toBe(3);
  expect(serializePrimitive(false, 10)).toBe(false);
  expect(serializePrimitive(2n, 10)).toBe("2n");
});

test("bounds strings and labels functions and symbols", () => {
  expect(serializePrimitive("abcdef", 3)).toBe("abc...[TRUNCATED]");
  expect(serializePrimitive("ok", 3)).toBe("ok");
  expect(serializePrimitive(function named() {}, 100)).toBe("[Function: named]");
  expect(serializePrimitive(() => {}, 100)).toBe("[Function: anonymous]");
  expect(serializePrimitive(Symbol("x"), 100)).toBe("[Symbol: x]");
  expect(serializePrimitive(Symbol(), 100)).toBe("[Symbol: ]");
});

test("bounds string representations of BigInts, functions, and symbols", () => {
  const named = Object.defineProperty(function value() {}, "name", { value: "long-name" });

  expect(serializePrimitive(123456n, 3)).toBe("123...[TRUNCATED]");
  expect(serializePrimitive(named, 3)).toBe("[Fu...[TRUNCATED]");
  expect(serializePrimitive(Symbol("long-description"), 3)).toBe("[Sy...[TRUNCATED]");
});
