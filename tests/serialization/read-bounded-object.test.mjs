import { readBoundedObject } from "../../src/serialization/read-bounded-object.mjs";
test("reads bounded data properties", () =>
  expect(readBoundedObject({ a: 1, b: 2 }, 1).__truncated).toBe("[TRUNCATED]"));
test("avoids truncation-key collisions and hostile descriptors", () => {
  expect(readBoundedObject({ __truncated: "keep", a: 1 }, 1).___truncated).toBe(
    "[TRUNCATED]",
  );
  const value = {};
  Object.defineProperty(value, "bad", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });
  expect(readBoundedObject(value, 2)).toEqual({});
});
