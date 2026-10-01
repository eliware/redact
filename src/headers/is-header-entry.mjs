export function isHeaderEntry(entry) {
  try {
    return Array.isArray(entry) && entry.length >= 2;
  } catch {
    return false;
  }
}
