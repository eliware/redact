import { copyErrorFields } from "../../inspection/copy-error-fields.mjs";

export function redactError(error, policy, redactChild, maxKeys = Infinity) {
  try {
    return copyErrorFields(error, maxKeys, (key, value) =>
      policy.keys.has(key.toLowerCase()) ? policy.marker : redactChild(value),
    );
  } catch {
    return {};
  }
}
