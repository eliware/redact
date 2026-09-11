export function readHeaderEntries(headers) {
  if (
    headers &&
    !Array.isArray(headers) &&
    typeof headers.entries === "function"
  ) {
    try {
      const entries = [];
      for (const entry of headers.entries()) {
        entries.push(entry);
        if (entries.length === 1000) break;
      }
      return entries;
    } catch {
      return [];
    }
  }
  if (Array.isArray(headers))
    return headers.filter((entry) => Array.isArray(entry) && entry.length >= 2);
  try {
    return Object.entries(headers ?? {});
  } catch {
    return [];
  }
}
