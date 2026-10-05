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
      yield ["authorization", "second secret"];
    },
  };

  expect(redactHeaders(headers)).toEqual({ authorization: "[REDACTED]" });
});

test("handles null input", () => {
  expect(redactHeaders(null)).toEqual({});
});
