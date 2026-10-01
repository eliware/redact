import { serializePrimitiveValue } from "../../src/serialization/serialize-primitive-value.mjs";

test("redacts serialized string primitives using text rules and literal secrets", () => {
  expect(
    serializePrimitiveValue("token=known", {
      maxString: 100,
      secrets: ["known"],
    }),
  ).toEqual({ handled: true, value: "token=[REDACTED]" });
});

test("leaves handled non-string primitives unchanged", () => {
  expect(serializePrimitiveValue(42, { maxString: 100 })).toEqual({ handled: true, value: 42 });
});
