export function redactArrayProperties(value, output, policy, limits, retainedValues, redactChild) {
  let truncated = false;
  const properties = [];

  for (const key of Object.keys(value)) {
    if (isArrayIndex(key, value.length)) continue;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor) continue;
    if (
      !policy.keys.has(key.toLowerCase()) &&
      "value" in descriptor &&
      typeof descriptor.value === "function"
    )
      continue;
    if (properties.length < limits.maxKeys) properties.push(key);
    else truncated = true;
  }

  for (const key of properties) {
    if (retainedValues >= limits.maxKeys) {
      truncated = true;
      break;
    }
    const child = policy.keys.has(key.toLowerCase()) ? policy.marker : redactChild(value[key]);
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

function isArrayIndex(key, length) {
  const index = Number(key);
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < length &&
    index < 4294967295 &&
    String(index) === key
  );
}
