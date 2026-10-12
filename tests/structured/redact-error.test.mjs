import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";
import { redactError } from "../../src/structured/redact-error.mjs";
import { redactValue } from "../../src/structured/redact-value.mjs";

test("copies error fields and redacts sensitive custom properties", () => {
  const error = Object.assign(new Error("failed"), {
    stack: "",
    name: "CustomError",
    token: "secret",
    detail: "safe",
  });
  const redactChild = (value) => value;

  expect(redactError(error, normalizePolicy(), redactChild)).toEqual({
    name: "CustomError",
    message: "failed",
    token: "[REDACTED]",
    detail: "safe",
  });
});

test("copies a stack and redacts custom child values", () => {
  const error = Object.assign(new Error("failed"), { detail: { token: "secret" } });
  const redactChild = (value) => (value.token ? { token: "[REDACTED]" } : value);
  const output = redactError(error, normalizePolicy(), redactChild);

  expect(output.stack).toContain("Error: failed");
  expect(output.detail).toEqual({ token: "[REDACTED]" });
});

test("applies configured sensitive keys to standard Error fields", () => {
  const error = new Error("sensitive message");
  error.stack = "sensitive stack";
  const policy = normalizePolicy({ keys: ["name", "message", "stack"] });

  expect(redactError(error, policy, (value) => value)).toEqual({
    name: "[REDACTED]",
    message: "[REDACTED]",
    stack: "[REDACTED]",
  });
});

test("returns an empty object when a custom Error property cannot be read", () => {
  const error = new Error("failed");
  Object.defineProperty(error, "blocked", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });

  expect(redactError(error, normalizePolicy(), (value) => value)).toEqual({});
});

test("returns an empty object when a standard Error field cannot be read", () => {
  const error = new Error("failed");
  Object.defineProperty(error, "name", {
    configurable: true,
    get() {
      throw new Error("blocked");
    },
  });

  expect(redactError(error, normalizePolicy(), (value) => value)).toEqual({});
});

test("returns an empty object when an Error child redaction fails", () => {
  const error = Object.assign(new Error("failed"), { detail: {} });

  expect(
    redactError(error, normalizePolicy(), () => {
      throw new Error("blocked");
    }),
  ).toEqual({});
});

test("counts enumerable standard fields against the key limit and reads them once", () => {
  const error = new Error("failed");
  const reads = { name: 0, message: 0, stack: 0 };
  for (const [key, value] of Object.entries({
    name: "CustomError",
    message: "failed",
    stack: "stack",
    token: "secret",
  }))
    Object.defineProperty(error, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (key in reads) reads[key]++;
        return value;
      },
    });

  expect(redactError(error, normalizePolicy(), (value) => value, 3)).toEqual({
    name: "CustomError",
    message: "failed",
    stack: "stack",
    __truncated: "[TRUNCATED]",
  });
  expect(reads).toEqual({ name: 1, message: 1, stack: 1 });

  reads.name = 0;
  reads.message = 0;
  reads.stack = 0;
  expect(redactError(error, normalizePolicy(), (value) => value, 2)).toEqual({
    message: "failed",
    stack: "stack",
    __truncated: "[TRUNCATED]",
  });
  expect(reads).toEqual({ name: 0, message: 1, stack: 1 });
});

test("marks custom Error properties omitted by the key limit", () => {
  const error = Object.assign(new Error("failed"), { first: 1, second: 2 });

  expect(redactError(error, normalizePolicy(), (value) => value, 1)).toMatchObject({
    first: 1,
    __truncated: "[TRUNCATED]",
  });
});

test("preserves a retained __truncated Error property when custom keys are omitted", () => {
  const error = Object.assign(new Error("failed"), {
    __truncated: "retained value",
    omitted: "omitted value",
  });

  expect(redactValue(error, { maxKeys: 1 })).toMatchObject({
    __truncated: "retained value",
    __truncated_1: "[TRUNCATED]",
  });
});

test("preserves an own __proto__ Error property as data", () => {
  const error = new Error("failed");
  Object.defineProperty(error, "__proto__", {
    value: { visible: "value" },
    enumerable: true,
  });

  const output = redactError(error, normalizePolicy(), (value) => value);
  expect(Object.hasOwn(output, "__proto__")).toBe(true);
  expect(output.__proto__).toEqual({ visible: "value" });
  expect(Object.getPrototypeOf(output)).toBe(Object.prototype);
});
