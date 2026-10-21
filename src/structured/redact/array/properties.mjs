import { isArrayIndexName } from "./index-name.mjs";

export function redactArrayProperties(value, output, policy, limits, retainedValues, redactChild) {
  let truncated = false;
  const properties = [];
  let keys;

  try {
    keys = Object.keys(value);
  } catch {
    return { truncated: true };
  }

  for (const key of keys) {
    if (isArrayIndexName(key, value.length)) continue;
    let descriptor;
    try {
      descriptor = Object.getOwnPropertyDescriptor(value, key);
    } catch {
      truncated = true;
      break;
    }
    if (!descriptor) continue;
    const sensitive = policy.keys.has(key.toLowerCase());
    let propertyValue;
    if (!sensitive && !("value" in descriptor)) {
      if (retainedValues + properties.length >= limits.maxKeys) {
        truncated = true;
        continue;
      }
      propertyValue = value[key];
      if (typeof propertyValue === "function") continue;
    } else if (!sensitive) {
      propertyValue = descriptor.value;
      if (typeof propertyValue === "function") continue;
    }
    if (retainedValues + properties.length < limits.maxKeys) {
      properties.push({ key, propertyValue });
    } else {
      truncated = true;
    }
  }

  for (const property of properties) {
    const { key, propertyValue } = property;
    const sensitive = policy.keys.has(key.toLowerCase());
    const child = sensitive ? policy.marker : redactChild(propertyValue);
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
