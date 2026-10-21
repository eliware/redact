import { isArrayIndexName } from "./index-name.mjs";

export function redactArrayProperties(value, output, policy, limits, retainedValues, redactChild) {
  let truncated = false;
  const properties = [];
  let keys;

  try {
    keys = Reflect.ownKeys(value);
  } catch {
    return { truncated: true };
  }

  let retained = retainedValues;
  for (const key of keys) {
    if (typeof key !== "string" || key === "length" || isArrayIndexName(key, value.length))
      continue;
    const sensitive = policy.keys.has(key.toLowerCase());
    let descriptor;
    try {
      descriptor = Object.getOwnPropertyDescriptor(value, key);
    } catch {
      truncated = true;
      break;
    }
    if (!descriptor || !descriptor.enumerable) continue;
    if (!sensitive && retained >= limits.maxKeys) {
      truncated = true;
      continue;
    }
    let propertyValue;
    if (!sensitive && !("value" in descriptor)) {
      propertyValue = value[key];
      if (typeof propertyValue === "function") continue;
    } else if (!sensitive) {
      propertyValue = descriptor.value;
      if (typeof propertyValue === "function") continue;
    }
    properties.push({ key, propertyValue });
    if (!sensitive) retained++;
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
  }

  return { truncated };
}
