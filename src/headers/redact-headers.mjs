import { readHeaderEntries } from './header-entry-reader.mjs';
import { redactHeaderValue } from './header-value-redactor.mjs';

function normalizeHeaderNames(options) {
  const names = options.headerNames ?? ['authorization', 'cookie', 'set-cookie', 'proxy-authorization', 'x-api-key'];
  if (typeof names === 'string' || names == null || typeof names[Symbol.iterator] !== 'function') throw new TypeError('headerNames must be iterable');
  return new Set([...names].map(value => String(value).toLowerCase()));
}

export function redactHeaders(headers, options = {}) {
  const entries = readHeaderEntries(headers);
  const normalizedOptions = { ...options, normalizedHeaderNames: normalizeHeaderNames(options) };
  const redacted = entries.filter(([key]) => typeof key === 'string').map(([key, value]) => [key, redactHeaderValue(key, value, normalizedOptions)]);
  return Array.isArray(headers) ? redacted : Object.fromEntries(redacted);
}
