import { serializeValue } from "./serialize-value.mjs";
import { serializeStringValue } from "./serialize-string-value.mjs";

export function serializePrimitiveValue(value, limits) {
  const primitive = serializeValue(value, limits);
  if (!primitive.handled) return primitive;
  if (typeof value !== "string" || typeof primitive.value !== "string") return primitive;
  return { ...primitive, value: serializeStringValue(primitive.value, limits) };
}
