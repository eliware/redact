import { redactArrayProperties } from "./array/properties.mjs";
import { isArrayIndexName } from "./array/index-name.mjs";

export function redactArray(value, policy, limits, redactChild) {
  try {
    const length = value.length;
    const retained = Math.min(length, limits.maxArray);
    const items = [];
    items.length = retained;
    let retainedValues = 0;
    let truncated = length > retained;

    if (retainedValues >= limits.maxKeys) {
      truncated = redactRemainingSensitiveIndices(value, items, policy, 0, retained) || truncated;
    }

    for (let index = retainedValues >= limits.maxKeys ? retained : 0; index < retained; index++) {
      if (!Object.hasOwn(value, index)) continue;
      const sensitive = policy.keys.has(String(index).toLowerCase());
      items[index] = sensitive ? policy.marker : redactChild(value[index]);
      if (!sensitive) retainedValues++;
      if (retainedValues >= limits.maxKeys) {
        truncated =
          redactRemainingSensitiveIndices(value, items, policy, index + 1, retained) || truncated;
        break;
      }
    }

    const properties = redactArrayProperties(
      value,
      items,
      policy,
      limits,
      retainedValues,
      redactChild,
    );
    if (truncated || properties.truncated) items[items.length] = "[TRUNCATED]";
    return items;
  } catch {
    return [];
  }
}

function redactRemainingSensitiveIndices(value, output, policy, start, end) {
  let keys;
  try {
    keys = Reflect.ownKeys(value);
  } catch {
    return true;
  }
  let truncated = false;
  for (const key of keys) {
    if (typeof key !== "string" || !isArrayIndexName(key, end)) continue;
    const index = Number(key);
    if (index < start || index >= end) continue;
    if (policy.keys.has(key.toLowerCase())) output[index] = policy.marker;
    else truncated = true;
  }
  return truncated;
}
