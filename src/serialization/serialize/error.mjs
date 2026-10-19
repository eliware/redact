import { copyErrorFields } from "../../inspection/copy-error-fields.mjs";

export function serializeError(error, policy, limits, seen, depth, serialize) {
  return copyErrorFields(error, limits.maxKeys, (key, value) =>
    policy.keys.has(key.toLowerCase())
      ? policy.marker
      : serialize(value, policy, limits, seen, depth + 1),
  );
}
