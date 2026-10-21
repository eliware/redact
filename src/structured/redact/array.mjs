import { redactArrayProperties } from "./array/properties.mjs";

export function redactArray(value, policy, limits, redactChild) {
  try {
    const length = value.length;
    const retained = Math.min(length, limits.maxArray);
    const items = [];
    items.length = retained;
    let retainedValues = 0;
    let truncated = length > retained;

    for (let index = 0; index < retained; index++) {
      if (!Object.hasOwn(value, index)) continue;
      const sensitive = policy.keys.has(String(index).toLowerCase());
      if (!sensitive && retainedValues >= limits.maxKeys) {
        truncated = true;
        continue;
      }
      items[index] = sensitive ? policy.marker : redactChild(value[index]);
      if (!sensitive) retainedValues++;
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
