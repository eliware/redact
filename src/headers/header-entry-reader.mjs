export function readHeaderEntries(headers) {
  if (headers && !Array.isArray(headers) && typeof headers.entries === "function") {
    try {
      const entries = [];
      for (const entry of headers.entries()) {
        if (isHeaderEntry(entry)) entries.push(entry);
        if (entries.length === 1000) break;
      }
      return entries;
    } catch {
      return [];
    }
  }
  if (Array.isArray(headers)) return headers.filter(isHeaderEntry);
  try {
    return Object.entries(headers ?? {});
  } catch {
    return [];
  }
}

function isHeaderEntry(entry) {
  try {
    return Array.isArray(entry) && entry.length >= 2;
  } catch {
    return false;
  }
}
