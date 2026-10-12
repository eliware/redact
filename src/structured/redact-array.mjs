export function redactArray(value, policy, limits, redactChild) {
  try {
    const length = value.length;
    const retained = Math.min(length, limits.maxArray);
    const extraProperties = [];
    for (const key of Object.keys(value)) {
      const index = Number(key);
      const isArrayIndex =
        Number.isInteger(index) &&
        index >= 0 &&
        index < length &&
        index < 4294967295 &&
        String(index) === key;
      if (isArrayIndex) continue;
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor) continue;
      if (
        !policy.keys.has(key.toLowerCase()) &&
        "value" in descriptor &&
        typeof descriptor.value === "function"
      )
        continue;
      extraProperties.push(key);
    }
    const items = [];
    items.length = retained;
    for (let index = 0; index < retained; index++) {
      if (!Object.hasOwn(value, index)) continue;
      items[index] = policy.keys.has(String(index).toLowerCase())
        ? policy.marker
        : redactChild(value[index]);
    }
    const retainedProperties = Math.min(extraProperties.length, limits.maxKeys);
    for (let index = 0; index < retainedProperties; index++) {
      const key = extraProperties[index];
      const child = policy.keys.has(key.toLowerCase()) ? policy.marker : redactChild(value[key]);
      Object.defineProperty(items, key, {
        value: child,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
    if (length > retained || extraProperties.length > retainedProperties)
      items[items.length] = "[TRUNCATED]";
    return items;
  } catch {
    return [];
  }
}
