import { createSerializeContext } from "../../src/serialization/serialize-context.mjs";
test("creates recursive serialization context", () => {
  const context = createSerializeContext({}, {}, () => "ok");
  expect(context.child({}, 0)).toBe("ok");
});
