import { inspectErrorFields } from "../../src/inspection/inspect-error-fields.mjs";

test("reads non-enumerable standard fields and omits an empty stack", () => {
  const error = new Error("failed");
  error.stack = "";

  expect(inspectErrorFields(error, [], [])).toEqual([
    ["name", "Error"],
    ["message", "failed"],
  ]);
});

test("uses inspected values for enumerable fields without reading them again", () => {
  const error = new Error("failed");
  error.stack = "stack";
  let reads = 0;
  Object.defineProperty(error, "name", {
    enumerable: true,
    get() {
      reads++;
      return "CustomError";
    },
  });

  const entries = [["name", error.name]];

  expect(inspectErrorFields(error, entries, ["name"])[0]).toEqual(["name", "CustomError"]);
  expect(reads).toBe(1);
});

test("omits enumerable fields beyond the inspected key limit", () => {
  const error = new Error("failed");
  Object.defineProperty(error, "name", { value: "CustomError", enumerable: true });

  expect(inspectErrorFields(error, [], ["name"])).toEqual([
    ["message", "failed"],
    ["stack", error.stack],
  ]);
});
