export function isBuffer(value) {
  return typeof Buffer !== 'undefined' && Buffer.isBuffer(value);
}
