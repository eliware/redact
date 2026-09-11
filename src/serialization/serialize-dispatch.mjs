import { enforceDepthLimit } from "../limits/enforce-depth-limit.mjs";
import { isBuffer } from "../inspection/is-buffer.mjs";
import { isError } from "../inspection/is-error.mjs";
import { circularValue } from "./circular-value.mjs";
import { serializeArray } from "./serialize-array.mjs";
import { serializeError } from "./serialize-error.mjs";
import { serializeBuffer } from "./serialize-buffer.mjs";
import { serializeObject } from "./serialize-object.mjs";
import { unserializableValue } from "./unserializable-value.mjs";
import { serializeValue } from "./serialize-value.mjs";
import { redactText } from "../text/redact-text.mjs";
import { readBoundedObject } from "./read-bounded-object.mjs";

export function serializeDispatch(
  value,
  policy,
  limits,
  seen,
  depth,
  _serialize,
) {
  try {
    const primitive = serializeValue(value, limits);
    if (primitive.handled)
      return typeof value === "string" && typeof primitive.value === "string"
        ? redactText(primitive.value, { maxString: limits.maxString })
        : primitive.value;
    if (enforceDepthLimit(depth, limits.maxDepth)) return "[TRUNCATED]";
    if (seen.has(value)) return circularValue(policy.circularMarker);
    seen.add(value);
    try {
      if (isBuffer(value)) return serializeBuffer(value);
      if (isError(value))
        return serializeError(
          value,
          policy,
          (child, childDepth) =>
            serializeDispatch(
              child,
              policy,
              limits,
              seen,
              childDepth,
              serializeDispatch,
            ),
          depth,
        );
      if (Array.isArray(value))
        return serializeArray(value, limits.maxArray, (item) =>
          serializeDispatch(
            item,
            policy,
            limits,
            seen,
            depth + 1,
            serializeDispatch,
          ),
        );
      const source = readBoundedObject(value, limits.maxKeys);
      return serializeObject(source, limits.maxKeys, (key, child) =>
        policy.keys.has(key.toLowerCase())
          ? policy.marker
          : serializeDispatch(
              child,
              policy,
              limits,
              seen,
              depth + 1,
              serializeDispatch,
            ),
      );
    } finally {
      seen.delete(value);
    }
  } catch {
    return unserializableValue();
  }
}
