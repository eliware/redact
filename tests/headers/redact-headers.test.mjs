import { redactHeaders } from "../../src/index.mjs";

test("redacts sensitive headers and preserves safe headers", () => {
  expect(
    redactHeaders({
      Authorization: "Bearer secret",
      Accept: "application/json",
    }),
  ).toEqual({ Authorization: "[REDACTED]", Accept: "application/json" });
});

test("supports Headers and entry arrays", () => {
  expect(redactHeaders(new Headers({ token: "secret", accept: "json" }))).toEqual({
    token: "[REDACTED]",
    accept: "json",
  });
  expect(
    redactHeaders([
      ["password", "secret"],
      ["x-id", "7"],
    ]),
  ).toEqual([
    ["password", "[REDACTED]"],
    ["x-id", "7"],
  ]);
});

test("normalizes Headers-style entries to an object shape", () => {
  const headers = { entries: () => [["token", "secret"]] };
  expect(redactHeaders(headers)).toEqual({ token: "[REDACTED]" });
});

test("handles null input", () => {
  expect(redactHeaders(null)).toEqual({});
});

test("can disable heuristic header matching", () => {
  expect(redactHeaders({ token: "value" }, { matchHeuristics: false })).toEqual({ token: "value" });
});

test("custom header names remain additive to heuristics", () => {
  expect(
    redactHeaders({ token: "secret", "x-custom": "secret" }, { headerNames: ["x-custom"] }),
  ).toEqual({ token: "[REDACTED]", "x-custom": "[REDACTED]" });
});

test("custom names retain built-in sensitive names when heuristics are disabled", () => {
  expect(
    redactHeaders(
      { authorization: "secret", "x-custom": "secret" },
      { headerNames: ["x-custom"], matchHeuristics: false },
    ),
  ).toEqual({ authorization: "[REDACTED]", "x-custom": "[REDACTED]" });
});

test("normalizes custom header names case-insensitively", () => {
  expect(
    redactHeaders({ "X-CUSTOM": "secret" }, { headerNames: ["x-custom"], matchHeuristics: false }),
  ).toEqual({ "X-CUSTOM": "[REDACTED]" });
});

test("supports custom header names from a single-use iterable", () => {
  const headerNames = (function* () {
    yield "x-custom";
  })();
  expect(redactHeaders({ "x-custom": "secret" }, { headerNames, matchHeuristics: false })).toEqual({
    "x-custom": "[REDACTED]",
  });
});
