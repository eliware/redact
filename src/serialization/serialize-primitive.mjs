export function serializePrimitive(value, maxString) {
  if (value === null) return null;
  if (value === undefined) return "[Undefined]";
  if (typeof value === "string")
    return value.length > maxString ? `${value.slice(0, maxString)}...[TRUNCATED]` : value;
  if (typeof value === "bigint") return `${value}n`;
  if (typeof value === "function") return `[Function: ${value.name || "anonymous"}]`;
  if (typeof value === "symbol") return `[Symbol: ${value.description ?? ""}]`;
  return value;
}
