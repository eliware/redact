import { normalizeSensitiveKeys } from "../../src/policy/normalize-sensitive-keys.mjs";
test("normalizes sensitive key casing", () =>
  expect(normalizeSensitiveKeys(["TOKEN"]).has("token")).toBe(true));
