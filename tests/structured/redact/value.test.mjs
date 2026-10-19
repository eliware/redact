import { redactValue } from "../../../src/structured/redact/value.mjs";

test("redacts nested sensitive values without mutating input", () => {
  const input = { token: "secret", nested: { Password: "pass", ok: 1 }, list: [{ apiKey: "key" }] };
  expect(redactValue(input)).toEqual({
    token: "[REDACTED]",
    nested: { Password: "[REDACTED]", ok: 1 },
    list: [{ apiKey: "[REDACTED]" }],
  });
  expect(input.token).toBe("secret");
});

test("handles cycles", () => {
  const input = { token: "secret" };
  input.self = input;
  expect(redactValue(input).self).toBe("[CIRCULAR]");
});

test("redacts child values while respecting depth limits", () => {
  const input = { nested: { token: "secret", deeper: { value: true } } };

  expect(redactValue(input, { maxDepth: 1 })).toEqual({
    nested: { token: "[REDACTED]", deeper: "[TRUNCATED]" },
  });
});

test("truncates primitive children beyond the depth limit", () => {
  expect(redactValue({ value: "visible" }, { maxDepth: 0 })).toEqual({ value: "[TRUNCATED]" });
});

test.each([Infinity, -Infinity, Number.NaN])(
  "uses the default for non-finite maxDepth %s",
  (maxDepth) => {
    let input = { value: "leaf" };
    for (let index = 0; index < 30; index++) input = { next: input };

    let output = redactValue(input, { maxDepth });
    for (let index = 0; index < 20; index++) output = output.next;
    expect(output.next).toBe("[TRUNCATED]");
  },
);

test("normalizes fractional maxKeys before object redaction", () => {
  expect(redactValue({ first: "one", second: "two" }, { maxKeys: 1.9 })).toEqual({
    first: "one",
    __truncated: "[TRUNCATED]",
  });
});

test("dispatches array values and applies the array limit", () => {
  expect(redactValue([{ token: "secret" }, "omitted"], { maxArray: 1 })).toEqual([
    { token: "[REDACTED]" },
    "[TRUNCATED]",
  ]);
});

test("fails closed when classifying revoked proxies", () => {
  const revoked = Proxy.revocable({}, {});
  revoked.revoke();
  expect(redactValue(revoked.proxy)).toEqual({});
});

test("fails closed when classifying a hostile array proxy", () => {
  const input = new Proxy([], {
    getPrototypeOf() {
      throw new Error("blocked");
    },
  });

  expect(redactValue(input)).toEqual([]);
});

test("dispatches Error values and redacts recursive children", () => {
  const error = Object.assign(new Error("failed"), {
    detail: { token: "secret" },
  });
  error.self = error;

  expect(redactValue(error)).toMatchObject({
    name: "Error",
    message: "failed",
    detail: { token: "[REDACTED]" },
    self: "[CIRCULAR]",
  });
});
