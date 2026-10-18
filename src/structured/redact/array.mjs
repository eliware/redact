export function redactArray(value, policy, limits, redactChild) {
  try {
    const length = value.length;
    const retained = Math.min(length, limits.maxArray);
    const extraProperties = [];
    let extraPropertiesOmitted = false;
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
      if (extraProperties.length < limits.maxKeys) extraProperties.push(key);
      else extraPropertiesOmitted = true;
    }
    const items = [];
    items.length = retained;
    let retainedValues = 0;
    let truncated = length > retained || extraPropertiesOmitted;
    for (let index = 0; index < retained; index++) {
      if (!Object.hasOwn(value, index)) continue;
      if (retainedValues >= limits.maxKeys) {
        truncated = true;
        continue;
      }
      items[index] = policy.keys.has(String(index).toLowerCase())
        ? policy.marker
        : redactChild(value[index]);
      retainedValues++;
    }
    for (let index = 0; index < extraProperties.length; index++) {
      if (retainedValues >= limits.maxKeys) {
        truncated = true;
        break;
      }
      const key = extraProperties[index];
      let child;
      try {
        child = policy.keys.has(key.toLowerCase()) ? policy.marker : redactChild(value[key]);
      } catch {
        return [];
      }
      Object.defineProperty(items, key, {
        value: child,
        enumerable: true,
        configurable: true,
        writable: true,
      });
      retainedValues++;
    }
    if (truncated) items[items.length] = "[TRUNCATED]";
    return items;
  } catch {
    return [];
  }
}
