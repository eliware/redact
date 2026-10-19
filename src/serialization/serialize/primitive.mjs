export function serializePrimitive(value, maxString) {
  if (value === null) return null;
  if (value === undefined) return "[Undefined]";
  if (typeof value === "string") return boundRepresentation(value, maxString);
  if (typeof value === "bigint") return boundRepresentation(`${value}n`, maxString);
  if (typeof value === "function")
    return boundRepresentation(`[Function: ${value.name || "anonymous"}]`, maxString);
  if (typeof value === "symbol")
    return boundRepresentation(`[Symbol: ${value.description ?? ""}]`, maxString);
  return value;
}

function boundRepresentation(value, maxString) {
  if (value.length <= maxString) return value;
  if (maxString <= 0) return "";
  const marker = "...[TRUNCATED]";
  if (maxString < marker.length) return "…";
  return `${value.slice(0, maxString - marker.length)}${marker}`;
}
