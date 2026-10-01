import { redactHeaderValue } from "./header-value-redactor.mjs";

export function redactHeaderEntries(entries, options) {
  return entries
    .filter(([key]) => typeof key === "string")
    .map(([key, value]) => [key, redactHeaderValue(key, value, options)]);
}
