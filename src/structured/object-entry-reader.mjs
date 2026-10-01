export function readObjectEntries(value, maxEntries = Number.POSITIVE_INFINITY, excludedKeys = []) {
  const excluded = new Set(excludedKeys);
  try {
    return Reflect.ownKeys(value)
      .filter(
        (key) =>
          typeof key === "string" &&
          !excluded.has(key) &&
          Object.prototype.propertyIsEnumerable.call(value, key),
      )
      .slice(0, maxEntries)
      .flatMap((key) => {
        try {
          return [[key, value[key]]];
        } catch {
          return [];
        }
      });
  } catch {
    return [];
  }
}
