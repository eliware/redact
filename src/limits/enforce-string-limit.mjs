export function enforceStringLimit(value, maxString) {
  if (value.length <= maxString) return value;
  const marker = '[TRUNCATED]';
  return maxString >= marker.length ? `${value.slice(0, maxString - marker.length)}${marker}` : value.slice(0, maxString);
}
