import { inspectHeaderInput } from "../../src/headers/inspect-header-input.mjs";

test("classifies Headers-like iterables and captures their entries", () => {
  expect(inspectHeaderInput(new Headers({ accept: "json" }))).toEqual({
    type: "entries",
    entries: [["accept", "json"]],
  });
});

test("preserves entry arrays and ordinary object inputs", () => {
  const entries = [["token", "secret"]];
  const object = { token: "secret" };

  expect(inspectHeaderInput(entries)).toEqual({ type: "array", entries });
  expect(inspectHeaderInput(object)).toEqual({ type: "object", value: object });
  expect(inspectHeaderInput(null)).toEqual({ type: "object", value: {} });
});

test.each([
  [
    "entries method",
    {
      entries() {
        throw new Error("blocked");
      },
    },
  ],
  [
    "entries iterator",
    {
      entries() {
        return {
          *[Symbol.iterator]() {
            yield ["authorization", "secret"];
            throw new Error("blocked");
          },
        };
      },
    },
  ],
])("fails closed when the %s throws", (_case, input) => {
  expect(inspectHeaderInput(input)).toEqual({ type: "entries", entries: [] });
});

test("fails closed for a revoked proxy", () => {
  const { proxy, revoke } = Proxy.revocable({}, {});
  revoke();

  expect(inspectHeaderInput(proxy)).toEqual({ type: "entries", entries: [] });
});
