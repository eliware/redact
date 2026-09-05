export function readHeaderEntries(headers) {
  if (headers && !Array.isArray(headers) && typeof headers.entries === 'function') return [...headers.entries()];
  if (Array.isArray(headers)) return headers;
  return Object.entries(headers ?? {});
}
