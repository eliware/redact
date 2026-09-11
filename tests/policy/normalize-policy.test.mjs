import { normalizePolicy } from "../../src/policy/normalize-policy.mjs";

test("normalizes canonical key casing", () => {
  expect(normalizePolicy({ keys: ["API_KEY"] }).keys.has("api_key")).toBe(true);
});

test("uses defaults when options are omitted", () =>
  expect(normalizePolicy().keys.has("token")).toBe(true));

test("rejects non-iterable key collections clearly", () => {
  expect(() => normalizePolicy({ keys: 42 })).toThrow("keys must be iterable");
});

test("rejects non-boolean heuristic policy values", () => {
  expect(() => normalizePolicy({ matchHeuristics: "yes" })).toThrow(
    "matchHeuristics must be boolean",
  );
});
