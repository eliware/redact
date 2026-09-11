export function readBoundedObject(value, maxKeys) {
  const output = Object.create(null);
  let keys;
  try {
    keys = Object.keys(value);
  } catch {
    return output;
  }
  for (const [index, key] of keys.entries()) {
    if (index >= maxKeys) {
      let marker = "__truncated";
      while (Object.hasOwn(output, marker)) marker = `_${marker}`;
      output[marker] = "[TRUNCATED]";
      return output;
    }
    try {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (descriptor && "value" in descriptor) output[key] = descriptor.value;
    } catch {
      /* hostile property is omitted */
    }
  }
  return output;
}
