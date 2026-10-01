import { unserializableValue } from "./unserializable-value.mjs";
import { serializePrimitiveValue } from "./serialize-primitive-value.mjs";
import { serializeRecursiveValue } from "./serialize-recursive-value.mjs";
import { serializeComplexValue } from "./serialize-complex-value.mjs";

export function serializeDispatch(value, policy, limits, seen, depth) {
  try {
    const primitive = serializePrimitiveValue(value, limits);
    if (primitive.handled) return primitive.value;
    return serializeRecursiveValue(value, policy, limits, seen, depth, (complex, childDepth) =>
      serializeComplexValue(complex, policy, limits, seen, childDepth, serializeDispatch),
    );
  } catch {
    return unserializableValue();
  }
}
