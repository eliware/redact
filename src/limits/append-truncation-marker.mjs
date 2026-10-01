export function appendTruncationMarker(output, value = "[TRUNCATED]") {
  let key = "__truncated";
  while (Object.hasOwn(output, key)) key = `_${key}`;
  Object.defineProperty(output, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true,
  });
  return output;
}
