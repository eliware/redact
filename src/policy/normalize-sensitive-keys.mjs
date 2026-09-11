import { readonlySet } from "./readonly-set.mjs";
export function normalizeSensitiveKeys(keys) {
  if (keys == null || typeof keys[Symbol.iterator] !== "function")
    throw new TypeError("Redaction policy keys must be iterable");
  return readonlySet(
    new Set([...keys].map((key) => String(key).toLowerCase())),
  );
}
