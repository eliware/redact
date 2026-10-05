import { redactValue } from "../structured/redact-value.mjs";
import { inspectHeaderInput } from "./inspect-header-input.mjs";

export function redactHeaders(headers, options = {}) {
  const input = inspectHeaderInput(headers);
  if (input.type === "object") return redactValue(input.value, options);
  if (input.failed || (input.type === "array" && !validEntries(input.entries))) return [];
  const entries = input.entries.map(([key, value]) => [
    key,
    redactValue({ [key]: value }, options)[key],
  ]);
  return input.type === "entries" ? Object.fromEntries(entries) : entries;
}

function validEntries(entries) {
  return entries.every(
    (entry) => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === "string",
  );
}
