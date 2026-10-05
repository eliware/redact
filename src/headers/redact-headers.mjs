import { redactValue } from "../structured/redact-value.mjs";
import { inspectHeaderInput } from "./inspect-header-input.mjs";

export function redactHeaders(headers, options = {}) {
  const input = inspectHeaderInput(headers);
  if (input.type === "object") return redactValue(input.value, options);
  const entries = input.entries.map(([key, value]) => [
    key,
    redactValue({ [key]: value }, options)[key],
  ]);
  return input.type === "entries" ? Object.fromEntries(entries) : entries;
}
