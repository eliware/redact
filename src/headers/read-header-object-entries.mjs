export function readHeaderObjectEntries(headers) {
  try {
    return Object.entries(headers ?? {});
  } catch {
    return [];
  }
}
