import { redactValue } from "../structured/redact-value.mjs";
import { inspectHeaderInput } from "./inspect-header-input.mjs";

export function redactHeaders(headers, options = {}) {
  const input = inspectHeaderInput(headers);
  if (input.type === "object") return redactValue(input.value, options);
  // codescope ignore this because getter failures return [] through validation or conversion catches.
  if (input.failed || !validEntries(input.entries)) return [];
  try {
    const entries = input.entries.map(([key, value]) => {
      const record = {};
      Object.defineProperty(record, key, { value, enumerable: true });
      // codescope ignore this because record[key] reads the own data property created above.
      return [key, redactValue(record, options)[key]];
    });
    // codescope ignore this because validated string keys allow duplicate names to collapse by design.
    if (input.type !== "entries") return entries;
    const byName = new Map();
    // codescope ignore this because header names become lowercase Map keys before insertion.
    for (const entry of entries) byName.set(entry[0].toLowerCase(), entry);
    // codescope ignore this because each lowercase key stores only its final original-case entry.
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
