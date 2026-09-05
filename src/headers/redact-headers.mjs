import { readHeaderEntries } from './header-entry-reader.mjs';
import { redactHeaderValue } from './header-value-redactor.mjs';

export function redactHeaders(headers, options = {}) {
  const entries = readHeaderEntries(headers);
  const redacted = entries.map(([key, value]) => [key, redactHeaderValue(key, value, options)]);
  return Array.isArray(headers) ? redacted : Object.fromEntries(redacted);
}
