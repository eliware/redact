export function readObjectEntries(value, maxEntries = Number.POSITIVE_INFINITY, excludedKeys = []) {
  const excluded = new Set(excludedKeys);
  const entries = [];
  let keys;
  try {
    keys = Reflect.ownKeys(value);
  } catch {
    return [];
  }
  for (const key of keys) {
    if (typeof key !== "string" || excluded.has(key)) continue;
    if (entries.length >= maxEntries) break;
    try {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor?.enumerable || !("value" in descriptor)) continue;
      entries.push([key, descriptor.value]);
    } catch {
      // Unreadable properties are omitted without invoking their getters.
    }
  }
  return entries;
}
