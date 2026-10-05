export function addTruncationMarker(output) {
  let key = "__truncated";
  let suffix = 0;
  while (Object.hasOwn(output, key)) key = `__truncated_${++suffix}`;
  Object.defineProperty(output, key, {
    value: "[TRUNCATED]",
    enumerable: true,
    configurable: true,
    writable: true,
  });
}
