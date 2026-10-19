import { isArrayIndexName } from "./array/index-name.mjs";

export function redactArrayProperties(value, output, policy, limits, retainedValues, redactChild) {
  let truncated = false;
  const properties = [];

  for (const key of Object.keys(value)) {
    if (isArrayIndexName(key, value.length)) continue;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor) continue;
    const sensitive = policy.keys.has(key.toLowerCase());
    const hasValue = !sensitive && !("value" in descriptor);
    let propertyValue;
    if (!sensitive && "value" in descriptor && typeof descriptor.value === "function") continue;
    if (hasValue) {
      if (retainedValues + properties.length >= limits.maxKeys) {
        truncated = true;
        continue;
      }
      propertyValue = value[key];
      if (typeof propertyValue === "function") continue;
    }
    if (retainedValues + properties.length < limits.maxKeys) {
      properties.push({ key, propertyValue, hasValue });
    } else {
      truncated = true;
    }
  }

  for (const property of properties) {
    const { key, propertyValue, hasValue } = property;
    const sensitive = policy.keys.has(key.toLowerCase());
    const childValue = sensitive || !hasValue ? value[key] : propertyValue;
    const child = sensitive ? policy.marker : redactChild(childValue);
    Object.defineProperty(output, key, {
      value: child,
      enumerable: true,
      configurable: true,
      writable: true,
    });
    retainedValues++;
  }

  return { truncated };
}
