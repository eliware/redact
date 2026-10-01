import { redactProperty } from "./redact-property.mjs";

export function redactArrayItems(items, policy, redactChild) {
  return items.map((item) => {
    try {
      return redactProperty("", item, policy, () => redactChild(item));
    } catch {
      return "[UNSERIALIZABLE]";
    }
  });
}
