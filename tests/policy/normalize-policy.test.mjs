import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";

test("normalizes aliases and key casing", () => {
  expect(normalizePolicy({ redactKeys: ["API_KEY"] }).keys.has("api_key")).toBe(true);
});

test("uses the default sensitive keys when options are omitted", () => {
  expect(normalizePolicy().keys.has("password")).toBe(true);
});

test("ignores a key that throws during string conversion", () => {
  const key = {
    toString: () => {
      throw new Error("blocked");
    },
  };

  expect(() => normalizePolicy({ keys: [key] })).not.toThrow();
  expect(normalizePolicy({ keys: [key] }).keys.size).toBe(0);
});
