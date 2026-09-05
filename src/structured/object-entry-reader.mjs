export function readObjectEntries(value) {
  try { return Object.entries(value); } catch { return []; }
}
