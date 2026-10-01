import { readSafeErrorField } from "../../src/errors/read-safe-error-field.mjs";

test("reads safe Error fields and falls back for throwing accessors", () => {
  const error = Object.defineProperty({}, "message", {
    get() {
      throw new Error("blocked");
    },
  });
  expect(readSafeErrorField({ name: "RequestError" }, "name")).toBe("RequestError");
  expect(readSafeErrorField(error, "message")).toBeUndefined();
});
