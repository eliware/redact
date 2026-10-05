export function safeEntries(value) {
  try {
    return Object.entries(value);
  } catch {
    return [];
  }
}
