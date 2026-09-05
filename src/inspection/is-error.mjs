export function isError(value) {
  try { return value instanceof Error || Object.prototype.toString.call(value) === '[object Error]'; } catch { return false; }
}
