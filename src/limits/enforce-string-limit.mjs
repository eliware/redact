export function enforceStringLimit(value, maxString) {
  return value.length > maxString ? `${value.slice(0, maxString)}...[TRUNCATED]` : value;
}
