export function normalizeSerializationLimits(options, defaults) {
  const limits = { ...defaults, ...options };
  for (const name of ['maxDepth', 'maxKeys', 'maxArray', 'maxString']) {
    if (limits[name] !== undefined && (!Number.isInteger(limits[name]) || limits[name] < 0)) throw new TypeError(`${name} must be a non-negative integer`);
  }
  return limits;
}
