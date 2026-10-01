import { readBoundedObject } from "./read-bounded-object.mjs";

const standardFields = new Set(["name", "message", "stack"]);

export function serializeErrorMetadata(error, policy, serialize, depth, maxKeys) {
  const source = readBoundedObject(error, maxKeys, standardFields);
  return Object.entries(source).map(([key, value]) => [
    key,
    policy.keys.has(key.toLowerCase()) ? policy.marker : serialize(value, depth + 1),
  ]);
}
