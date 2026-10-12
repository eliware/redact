import { redactHeaders } from "../../src/headers/redact-headers.mjs";

test("redacts sensitive headers and preserves safe headers", () => {
  expect(redactHeaders({ Authorization: "Bearer secret", Accept: "application/json" })).toEqual({
    Authorization: "[REDACTED]",
    Accept: "application/json",
  });
});

test("redacts values consistently for Headers and entry arrays", () => {
  const fromHeaders = redactHeaders(new Headers({ token: "secret", accept: "json" }));
  expect(fromHeaders).toEqual({
    token: "[REDACTED]",
    accept: "json",
  });
  expect(fromHeaders.accept).toBe("json");
  const fromEntries = redactHeaders([
    ["password", "secret"],
    ["x-id", "7"],
  ]);
  expect(fromEntries).toEqual([
    ["password", "[REDACTED]"],
    ["x-id", "7"],
  ]);
  expect(fromEntries[1][1]).toBe("7");
});

test("preserves duplicate entry-array names and redacts duplicate sensitive values", () => {
  expect(
    redactHeaders([
      ["authorization", "first secret"],
      ["authorization", "second secret"],
      ["x-id", "first"],
      ["x-id", "second"],
    ]),
  ).toEqual([
    ["authorization", "[REDACTED]"],
    ["authorization", "[REDACTED]"],
    ["x-id", "first"],
    ["x-id", "second"],
  ]);
});

test("collapses duplicate names from Headers-like inputs after redacting each value", () => {
  const headers = {
    *entries() {
      yield ["authorization", "first secret"];
      yield ["Authorization", "second secret"];
    },
  };

  expect(redactHeaders(headers)).toEqual({ authorization: "[REDACTED]" });
});

test("redacts a Headers-like __proto__ name as an own property", () => {
  const headers = {
    *entries() {
      yield ["__proto__", "secret"];
    },
  };
  const output = redactHeaders(headers, { keys: ["__proto__"] });

  expect(Object.hasOwn(output, "__proto__")).toBe(true);
  expect(output.__proto__).toBe("[REDACTED]");
  expect(Object.getPrototypeOf(output)).toBe(Object.prototype);
});

test("handles null input", () => {
  expect(redactHeaders(null)).toEqual({});
});

test("returns an empty entry array for malformed or unreadable entries", () => {
  expect(redactHeaders([null])).toEqual([]);
  expect(redactHeaders([["token", "secret"], ["missing-value"]])).toEqual([]);
  expect(redactHeaders([["token", "secret", "extra"]])).toEqual([]);
  expect(
    redactHeaders({
      entries() {
        throw new Error("blocked");
      },
    }),
  ).toEqual([]);
  expect(
    redactHeaders({
      entries() {
        return {
          [Symbol.iterator]() {
            throw new Error("blocked");
          },
        };
      },
    }),
  ).toEqual([]);
});

test("returns an empty entry array for malformed Headers-like pairs", () => {
  expect(
    redactHeaders({
      *entries() {
        yield [1, "secret"];
      },
    }),
  ).toEqual([]);
  expect(
    redactHeaders({
      *entries() {
        yield ["token"];
      },
    }),
  ).toEqual([]);
  expect(
    redactHeaders({
      *entries() {
        yield ["x-id", 7];
      },
    }),
  ).toEqual([]);
});

test("returns an empty entry array when a Headers-like pair throws during validation", () => {
  const pair = new Proxy(["token", "secret"], {
    get(target, key, receiver) {
      if (key === "length") throw new Error("blocked");
      return Reflect.get(target, key, receiver);
    },
  });

  expect(
    redactHeaders({
      *entries() {
        yield pair;
      },
    }),
  ).toEqual([]);
});

test("returns an empty entry array when a pair changes after validation", () => {
  let lengthReads = 0;
  const pair = new Proxy(["token", "secret"], {
    get(target, key, receiver) {
      if (key === "length" && ++lengthReads > 1) throw new Error("blocked");
      return Reflect.get(target, key, receiver);
    },
  });

  expect(redactHeaders([pair])).toEqual([]);
});
