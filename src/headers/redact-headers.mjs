import { readHeaderEntries } from './header-entry-reader.mjs';
import { redactHeaderValue } from './header-value-redactor.mjs';

function normalizeHeaderNames(options) {
  const defaults = ['authorization', 'cookie', 'set-cookie', 'proxy-authorization', 'x-api-key'];
  const custom = options.headerNames;
  if (custom != null && (typeof custom === 'string' || typeof custom[Symbol.iterator] !== 'function')) throw new TypeError('headerNames must be iterable');
  const names = custom == null ? defaults : [...defaults, ...custom];
  return new Set([...names].map(value => String(value).toLowerCase()));
}

export function redactHeaders(headers, options = {}) {
  const entries = readHeaderEntries(headers);
  const normalizedOptions = { ...options, normalizedHeaderNames: normalizeHeaderNames(options) };
  const redacted = entries.filter(([key]) => typeof key === 'string').map(([key, value]) => [key, redactHeaderValue(key, value, normalizedOptions)]);
  if (Array.isArray(headers)) return redacted;
  const output = Object.create(null);
  for (const [key, value] of redacted) Object.defineProperty(output, key, { value, enumerable: true, configurable: true, writable: true });
  return output;
}
