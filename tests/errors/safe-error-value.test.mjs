import { safeErrorValue } from "../../src/errors/safe-error-value.mjs";

test("creates a safe error value", () => {
  expect(
    safeErrorValue(
      Object.assign(new Error("token=secret"), {
        details: { token: "secret" },
      }),
    ),
  ).toEqual({
    name: "Error",
    message: "token=[REDACTED]",
    details: { token: "[REDACTED]" },
  });
  expect(safeErrorValue(null)).toEqual({ message: "" });
  expect(safeErrorValue({ message: "plain", name: undefined })).toEqual({
    name: "Error",
    message: "plain",
  });
});

test("returns safe fallbacks when Error field accessors throw", () => {
  const error = new Proxy(
    {},
    {
      get(_target, key) {
        if (["name", "message", "details", "toString"].includes(key)) throw new Error("blocked");
        return undefined;
      },
    },
  );
  expect(safeErrorValue(error)).toEqual({ name: "Error", message: "" });
});
