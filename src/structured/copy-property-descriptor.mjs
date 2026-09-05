export function copyPropertyDescriptor(output, key, value) {
  Object.defineProperty(output, key, { value, enumerable: true, configurable: true, writable: true });
  return output;
}
