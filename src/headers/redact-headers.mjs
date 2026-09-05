import { redactValue } from '../structured/redact-value.mjs';

export function redactHeaders(headers, options = {}) {
  if (headers && !Array.isArray(headers) && typeof headers.entries === 'function') return Object.fromEntries([...headers.entries()].map(([key, value]) => [key, redactValue({ [key]: value }, options)[key]]));
  if (Array.isArray(headers)) return headers.map(([key, value]) => [key, redactValue({ [key]: value }, options)[key]]);
  return redactValue(headers ?? {}, options);
}
