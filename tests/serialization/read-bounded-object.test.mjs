import { readBoundedObject } from "../../src/serialization/read-bounded-object.mjs";
test("reads bounded data properties", () =>
  expect(readBoundedObject({ a: 1, b: 2 }, 1).__truncated).toBe("[TRUNCATED]"));
test("avoids truncation-key collisions and hostile descriptors", () => {
  expect(readBoundedObject({ __truncated: "keep", a: 1 }, 1).___truncated).toBe("[TRUNCATED]");
  const value = {};
  Object.defineProperty(value, "bad", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });
  expect(readBoundedObject(value, 2)).toEqual({});
});

test("does not invoke enumerable Error metadata getters", () => {
  let invoked = false;
  const value = Object.defineProperty({}, "token", {
    enumerable: true,
    get() {
      invoked = true;
      return "secret";
    },
  });
  expect(readBoundedObject(value, 2)).toEqual(Object.create(null));
  expect(invoked).toBe(false);
});

test("does not spend the retained-key limit on skipped accessors", () => {
  const value = {};
  Object.defineProperty(value, "blocked", {
    enumerable: true,
    get() {
      throw new Error("must not run");
    },
  });
  value.safe = "visible";
  expect(readBoundedObject(value, 1)).toEqual({ safe: "visible" });
});
