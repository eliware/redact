export function isArrayIndexName(key, length) {
  const index = Number(key);
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < length &&
    index < 4294967295 &&
    String(index) === key
  );
}
