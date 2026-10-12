import { redactValue } from "../../src/structured/redact-value.mjs";

// codescope ignore this because structured redaction has no string-size option.
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

test("does not redact inherited numeric values from sparse arrays", () => {
  const prototype = Object.create(Array.prototype, {
    0: { value: "inherited-secret", enumerable: true },
  });
  const input = [];
  input.length = 1;
  Object.setPrototypeOf(input, prototype);

  const output = redactValue(input);
  expect(output).toHaveLength(1);
  expect(Object.hasOwn(output, 0)).toBe(false);
  expect(0 in output).toBe(false);
});

test("bounds nested depth while redacting retained secrets", () => {
  const input = { nested: { token: "secret", deeper: { value: true } }, omitted: "value" };

  expect(redactValue(input, { maxDepth: 1 })).toEqual({
    nested: { token: "[REDACTED]", deeper: "[TRUNCATED]" },
    omitted: "value",
  });
});

test("truncates primitive children beyond the depth limit", () => {
  expect(redactValue({ value: "visible" }, { maxDepth: 0 })).toEqual({ value: "[TRUNCATED]" });
});

test.each([Infinity, -Infinity, Number.NaN])(
  "normalizes non-finite maxDepth %s to the default",
  (maxDepth) => {
    let input = { value: "leaf" };
    for (let index = 0; index < 30; index++) input = { next: input };

    let output = redactValue(input, { maxDepth });
    for (let index = 0; index < 20; index++) output = output.next;
    expect(output.next).toBe("[TRUNCATED]");
  },
);

test("bounds retained object keys and marks omitted properties", () => {
  expect(redactValue({ first: 1, second: 2 }, { maxKeys: 1 })).toEqual({
    first: 1,
    __truncated: "[TRUNCATED]",
  });
});

test("normalizes fractional and non-finite key and array limits", () => {
  expect(redactValue({ first: 1, second: 2 }, { maxKeys: 1.9 })).toEqual({
    first: 1,
    __truncated: "[TRUNCATED]",
  });
  expect(redactValue([1, 2, 3], { maxArray: 1.9 })).toEqual([1, "[TRUNCATED]"]);
  const limited = redactValue(
    Array.from({ length: 1001 }, (_, index) => index),
    {
      maxArray: Infinity,
    },
  );
  expect(limited).toHaveLength(1001);
  expect(limited[1000]).toBe("[TRUNCATED]");
});

test("preserves a retained __truncated property and adds a separate marker", () => {
  const input = { __truncated: "retained value", omitted: "omitted value" };

  expect(redactValue(input, { maxKeys: 1 })).toEqual({
    __truncated: "retained value",
    __truncated_1: "[TRUNCATED]",
  });
});

test("bounds array items and marks omitted items", () => {
  expect(redactValue([{ safe: 1 }, { token: "secret" }], { maxArray: 1 })).toEqual([
    { safe: 1 },
    "[TRUNCATED]",
  ]);
});

test("does not rely on overridable array slice or map methods", () => {
  const input = [{ token: "secret" }];
  input.slice = () => {
    throw new Error("overridden");
  };
  input.map = () => {
    throw new Error("overridden");
  };

  expect(redactValue(input)).toEqual([{ token: "[REDACTED]" }]);
});

// codescope ignore this because hostile arrays fail closed to an empty array by contract.
test("returns an empty array when reading a hostile array item throws", () => {
  const input = new Proxy([{ token: "secret" }], {
    get(target, key, receiver) {
      if (key === "0") throw new Error("blocked");
      return Reflect.get(target, key, receiver);
    },
  });

  expect(redactValue(input)).toEqual([]);
});

// codescope ignore this because hostile object classification failures use a safe empty result.
test("fails closed when classifying revoked proxies or hostile array proxies", () => {
  const revoked = Proxy.revocable({}, {});
  revoked.revoke();
  expect(redactValue(revoked.proxy)).toEqual({});

  // codescope ignore this because the array classification survives a throwing prototype trap.
  // codescope ignore this because array classification survives a throwing prototype trap.
  const hostileArray = new Proxy([], {
    getPrototypeOf() {
      throw new Error("blocked");
    },
  });
  expect(redactValue(hostileArray)).toEqual([]);
});

test("bounds custom Error properties", () => {
  const error = Object.assign(new Error("failed"), { first: 1, token: "secret", last: 3 });

  expect(redactValue(error, { maxKeys: 1 })).toMatchObject({
    first: 1,
    __truncated: "[TRUNCATED]",
  });
  expect(Object.hasOwn(redactValue(error, { maxKeys: 1 }), "token")).toBe(false);
});

test("preserves an own __proto__ key without changing the result prototype", () => {
  const input = {};
  Object.defineProperty(input, "__proto__", { value: { visible: "value" }, enumerable: true });

  const output = redactValue(input);
  expect(Object.hasOwn(output, "__proto__")).toBe(true);
  expect(output.__proto__).toEqual({ visible: "value" });
  expect(Object.getPrototypeOf(output)).toBe(Object.prototype);
});

test("returns an empty record if an enumerable getter prevents complete redaction", () => {
  const input = { safe: "visible" };
  Object.defineProperty(input, "blocked", {
    enumerable: true,
    get() {
      throw new Error("blocked");
    },
  });

  expect(redactValue(input)).toEqual({});
});

test("coordinates Error redaction with recursive child values", () => {
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
