import { redactHeaderEntries } from "../../src/headers/redact-header-entries.mjs";

test("filters invalid names and redacts values according to header policy", () => {
  expect(
    redactHeaderEntries(
      [
        ["authorization", "secret"],
        [Symbol("header"), "value"],
        ["accept", "json"],
      ],
      { normalizedHeaderNames: new Set(["authorization"]) },
    ),
  ).toEqual([
    ["authorization", "[REDACTED]"],
    ["accept", "json"],
  ]);
});
