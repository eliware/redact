export function readSafeEntries(value) {
  try { return Object.entries(value); } catch { return []; }
}
