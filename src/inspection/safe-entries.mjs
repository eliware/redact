export function safeEntries(value, maxEntries = Infinity) {
  return inspectEntries(value, maxEntries).entries;
}

export function inspectEntries(value, maxEntries = Infinity, includeKey) {
  try {
    const keys = Object.keys(value);
    const entries = [];
    for (const key of keys) {
      if (includeKey && !includeKey(key)) continue;
      if (entries.length >= maxEntries) return { entries, failed: false, truncated: true };
      entries.push([key, value[key]]);
    }
    return { entries, failed: false, truncated: false };
  } catch {
    return { entries: [], failed: true, truncated: false };
  }
}
