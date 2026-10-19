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
