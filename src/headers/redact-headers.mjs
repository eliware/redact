import { readHeaderEntries } from './header-entry-reader.mjs';
import { redactHeaderValue } from './header-value-redactor.mjs';
import { normalizeHeaderNames } from './header-name-normalizer.mjs';

export function redactHeaders(headers, options = {}) {
  const entries = readHeaderEntries(headers);
  const normalizedOptions = { ...options, normalizedHeaderNames: normalizeHeaderNames(options.headerNames) };
  const redacted = entries.filter(([key]) => typeof key === 'string').map(([key, value]) => [key, redactHeaderValue(key, value, normalizedOptions)]);
  if (Array.isArray(headers)) return redacted;
  const output = Object.create(null);
  for (const [key, value] of redacted) Object.defineProperty(output, key, { value, enumerable: true, configurable: true, writable: true });
  return output;
}
