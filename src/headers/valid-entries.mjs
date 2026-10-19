export function validEntries(entries) {
  try {
    return entries.every(
      (entry) =>
        Array.isArray(entry) &&
        entry.length === 2 &&
        typeof entry[0] === "string" &&
        typeof entry[1] === "string",
    );
  } catch {
    return false;
  }
}
