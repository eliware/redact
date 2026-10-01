export function readSafeErrorField(error, key) {
  try {
    return error?.[key];
  } catch {
    return undefined;
  }
}
