export function selectBoundedArray(value, limit) {
  if (!Number.isInteger(limit) || limit < 0)
    throw new TypeError("maxArray must be a non-negative integer");
  try {
    const items = value.slice(0, limit);
    if (!Array.isArray(items)) return null;
    return { items, truncated: value.length > limit };
  } catch {
    return null;
  }
}
