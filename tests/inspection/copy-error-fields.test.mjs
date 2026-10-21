import { copyErrorFields } from "../../src/inspection/copy-error-fields.mjs";

test("copies standard and custom Error fields through the value mapper", () => {
  const error = Object.assign(new Error("failed"), { detail: "visible" });

  const output = copyErrorFields(error, 10, (key, value) =>
    key === "message" ? value.toUpperCase() : value,
  );

  expect(output).toMatchObject({ name: "Error", message: "FAILED", detail: "visible" });
  expect(output.stack).toContain("Error: failed");
});

test("marks standard Error fields that exceed maxKeys", () => {
  const output = copyErrorFields(new Error("failed"), 0, (_key, value) => value);

  expect(output).toEqual({ __truncated: "[TRUNCATED]" });
});

test("does not read an enumerable Error field beyond maxKeys", () => {
  const error = new Error("failed");
  let reads = 0;
  delete error.message;
  Object.defineProperty(error, "name", { value: "CustomError", enumerable: true });
  Object.defineProperty(error, "message", {
    enumerable: true,
    get() {
      reads++;
      throw new Error("should not read an omitted field");
    },
  });

  const output = copyErrorFields(error, 1, (_key, value) => value);

  expect(output).toEqual({ name: "CustomError", __truncated: "[TRUNCATED]" });
  expect(reads).toBe(0);
});
