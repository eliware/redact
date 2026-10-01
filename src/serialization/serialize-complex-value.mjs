import { isBuffer } from "../inspection/is-buffer.mjs";
import { isError } from "../inspection/is-error.mjs";
import { serializeArray } from "./serialize-array.mjs";
import { serializeBuffer } from "./serialize-buffer.mjs";
import { serializeError } from "./serialize-error.mjs";
import { serializeObjectValue } from "./serialize-object-value.mjs";

export function serializeComplexValue(value, policy, limits, seen, depth, serialize) {
  if (isBuffer(value)) return serializeBuffer(value);
  if (isError(value))
    return serializeError(
      value,
      policy,
      (child, childDepth) => serialize(child, policy, limits, seen, childDepth),
      depth,
      limits.maxKeys,
    );
  if (Array.isArray(value))
    return serializeArray(value, limits.maxArray, (item) =>
      serialize(item, policy, limits, seen, depth + 1),
    );
  return serializeObjectValue(value, policy, limits, seen, depth, serialize);
}
