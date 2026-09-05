export function readHeaderEntries(headers) {
  if (headers && !Array.isArray(headers) && typeof headers.entries === 'function') {
    try { return [...headers.entries()]; } catch { return []; }
  }
  if (Array.isArray(headers)) return headers.filter(entry => Array.isArray(entry) && entry.length >= 2);
  try { return Object.entries(headers ?? {}); } catch { return []; }
}
