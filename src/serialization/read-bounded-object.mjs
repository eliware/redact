import { readOwnDataProperty } from "./read-own-data-property.mjs";
import { appendTruncationMarker } from "../limits/append-truncation-marker.mjs";

export function readBoundedObject(value, maxKeys, excludedKeys = []) {
  const output = Object.create(null);
  const excluded = new Set(excludedKeys);
  let keys;
  try {
    keys = Object.keys(value);
  } catch {
    return output;
  }
  let count = 0;
  for (const key of keys) {
    if (excluded.has(key)) continue;
    if (count >= maxKeys) {
      return appendTruncationMarker(output);
    }
    count += 1;
    const property = readOwnDataProperty(value, key);
    if (property.found) output[key] = property.value;
  }
  return output;
}
