export function safeEntries(value, maxEntries = Infinity) {
  return inspectEntries(value, maxEntries).entries;
}

export function inspectEntries(value, maxEntries = Infinity) {
  try {
    const keys = Object.keys(value);
    const entries = [];
    for (const key of keys) {
      if (entries.length >= maxEntries) return { entries, keys, failed: false, truncated: true };
      entries.push([key, value[key]]);
    }
    return { entries, keys, failed: false, truncated: false };
    // codescope ignore this because enumeration and retained-value failures both fail closed.
  } catch {
    return { entries: [], keys: [], failed: true, truncated: false };
  }
}
