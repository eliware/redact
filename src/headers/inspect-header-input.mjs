export function inspectHeaderInput(headers) {
  if (headers && !Array.isArray(headers) && typeof headers.entries === "function")
    return { type: "entries", entries: [...headers.entries()] };
  if (Array.isArray(headers)) return { type: "array", entries: headers };
  return { type: "object", value: headers ?? {} };
}
