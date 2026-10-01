import { serializeErrorStandardFields } from "./serialize-error-standard-fields.mjs";
import { serializeErrorMetadata } from "./serialize-error-metadata.mjs";

export function serializeError(
  error,
  policy,
  serialize,
  depth,
  maxKeys = Number.POSITIVE_INFINITY,
) {
  const output = serializeErrorStandardFields(error, policy, serialize, depth);
  for (const [key, child] of serializeErrorMetadata(error, policy, serialize, depth, maxKeys))
    Object.defineProperty(output, key, {
      value: child,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  return output;
}
