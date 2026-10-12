import { redactValue } from "../structured/redact-value.mjs";
import { inspectHeaderInput } from "./inspect-header-input.mjs";

export function redactHeaders(headers, options = {}) {
  const input = inspectHeaderInput(headers);
  if (input.type === "object") return redactValue(input.value, options);
  if (input.failed || !validEntries(input.entries)) return [];
  try {
    const entries = input.entries.map(([key, value]) => {
      const record = {};
      Object.defineProperty(record, key, { value, enumerable: true });
      return [key, redactValue(record, options)[key]];
    });
    if (input.type !== "entries") return entries;
    const byName = new Map();
    for (const entry of entries) byName.set(entry[0].toLowerCase(), entry);
    return Object.fromEntries(byName.values());
  } catch {
    return [];
  }
}

function validEntries(entries) {
  try {
    return entries.every(
      (entry) =>
        Array.isArray(entry) &&
        entry.length === 2 &&
        typeof entry[0] === "string" &&
        typeof entry[1] === "string",
    );
  } catch {
    return false;
  }
}
