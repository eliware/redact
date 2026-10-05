import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";

test("normalizes aliases and key casing", () => {
  expect(normalizePolicy({ redactKeys: ["API_KEY"] }).keys.has("api_key")).toBe(true);
});

test("uses the default sensitive keys when options are omitted", () => {
  expect(normalizePolicy().keys.has("password")).toBe(true);
});
