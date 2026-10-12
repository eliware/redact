// codescope ignore this because maxString is the safeSerialize string-size limit.
export function serializePrimitive(value, maxString) {
  if (value === null) return null;
  if (value === undefined) return "[Undefined]";
  if (typeof value === "string")
    return value.length > maxString ? `${value.slice(0, maxString)}...[TRUNCATED]` : value;
  if (typeof value === "bigint") return boundRepresentation(`${value}n`, maxString);
  if (typeof value === "function")
    return boundRepresentation(`[Function: ${value.name || "anonymous"}]`, maxString);
  if (typeof value === "symbol")
    return boundRepresentation(`[Symbol: ${value.description ?? ""}]`, maxString);
  return value;
}

function boundRepresentation(value, maxString) {
  return value.length > maxString ? `${value.slice(0, maxString)}...[TRUNCATED]` : value;
}
