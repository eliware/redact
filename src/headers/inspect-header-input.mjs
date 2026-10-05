export function inspectHeaderInput(headers) {
  let isArray = false;
  try {
    isArray = Array.isArray(headers);
    if (headers && !isArray) {
      const entries = headers.entries;
      if (typeof entries === "function")
        return { type: "entries", entries: [...entries.call(headers)] };
    }
    if (isArray) return { type: "array", entries: headers };
    return { type: "object", value: headers ?? {} };
  } catch {
    return { type: "entries", entries: [] };
  }
}
