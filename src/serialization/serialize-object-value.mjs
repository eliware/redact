import { readBoundedObject } from "./read-bounded-object.mjs";
import { serializeObject } from "./serialize-object.mjs";

export function serializeObjectValue(value, policy, limits, seen, depth, serialize) {
  const source = readBoundedObject(value, limits.maxKeys);
  return serializeObject(source, Number.POSITIVE_INFINITY, (key, child) =>
    policy.keys.has(key.toLowerCase())
      ? policy.marker
      : serialize(child, policy, limits, seen, depth + 1),
  );
}
