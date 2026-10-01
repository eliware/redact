import { readErrorStandardFields } from "../../src/structured/read-error-standard-fields.mjs";

test("reads standard Error fields", () => {
  expect(
    readErrorStandardFields(Object.assign(new Error("failed"), { name: "RequestError" })),
  ).toMatchObject({
    name: "RequestError",
    message: "failed",
  });
});

test("reduces throwing standard field accessors to undefined", () => {
  const error = new Error("failed");
  Object.defineProperty(error, "name", {
    get() {
      throw new Error("blocked");
    },
  });
  expect(readErrorStandardFields(error).name).toBeUndefined();
});
