import { redactError } from "../../src/structured/redact-error.mjs";

test("redacts Error properties", () =>
  expect(
    redactError(
      Object.assign(new Error("x"), { token: "secret" }),
      { keys: new Set(["token"]), marker: "[x]" },
      (value) => value,
    ),
  ).toMatchObject({ token: "[x]" }));

test("redacts standard Error fields when their names are configured", () => {
  const error = Object.assign(new Error("private message"), {
    name: "PrivateError",
    stack: "private stack",
  });
  const output = redactError(
    error,
    { keys: new Set(["name", "message", "stack"]), marker: "[x]" },
    (value) => value,
  );
  expect(output).toMatchObject({ name: "[x]", message: "[x]", stack: "[x]" });
});
