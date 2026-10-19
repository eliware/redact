import { redactValue } from "../structured/redact/value.mjs";
import { inspectHeaderInput } from "./inspect-header-input.mjs";
import { validEntries } from "./valid-entries.mjs";

export function redactHeaders(headers, options = {}) {
  const input = inspectHeaderInput(headers);
  if (input.type === "object") return redactValue(input.value, options);
  if (input.failed || !validEntries(input.entries)) return [];
  try {
    const entries = input.entries.map(([key, value]) => {
      const record = {};
      const normalizedKey = key.toLowerCase();
      Object.defineProperty(record, normalizedKey, { value, enumerable: true });
      return [key, redactValue(record, options)[normalizedKey]];
    });
    if (input.type !== "entries") return entries;
    const byName = new Map();
    for (const [key, value] of entries) byName.set(key.toLowerCase(), value);
    return Object.fromEntries(byName);
  } catch {
    return [];
  }
}
