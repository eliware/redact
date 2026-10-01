export function buildHeaderOutput(headers, entries) {
  try {
    if (Array.isArray(headers)) return entries;
  } catch {
    // An unreadable representation falls back to the safe object form.
  }
  const output = Object.create(null);
  for (const [key, value] of entries)
    Object.defineProperty(output, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  return output;
}
