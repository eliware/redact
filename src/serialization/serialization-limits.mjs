export function normalizeSerializationLimits(options, defaults) {
  return { ...defaults, ...options };
}
