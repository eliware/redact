import { readOwnDataProperty } from "../../src/serialization/read-own-data-property.mjs";

test("reads own data properties including undefined values", () => {
  expect(readOwnDataProperty({ value: undefined }, "value")).toEqual({
    found: true,
    value: undefined,
  });
});

test("does not invoke accessors and handles hostile descriptors", () => {
  let invoked = false;
  const value = Object.defineProperty({}, "secret", {
    enumerable: true,
    get() {
      invoked = true;
      return "secret";
    },
  });
  expect(readOwnDataProperty(value, "secret")).toEqual({ found: false });
  const hostile = new Proxy(
    {},
    {
      getOwnPropertyDescriptor() {
        throw new Error("blocked");
      },
    },
  );
  expect(readOwnDataProperty(hostile, "secret")).toEqual({ found: false });
  expect(invoked).toBe(false);
});
