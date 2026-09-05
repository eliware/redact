import { enforceKeyLimit } from '../limits/enforce-key-limit.mjs';
import { readSafeEntries } from '../inspection/read-safe-entries.mjs';

export function serializeObject(value, maxKeys, serializeProperty, truncatedMarker = '[TRUNCATED]', sourceTruncated = false) {
  const output = {};
  for (const [index, [key, child]] of readSafeEntries(value).entries()) {
    if (enforceKeyLimit(index, maxKeys)) {
      let key = '__truncated';
      while (Object.hasOwn(output, key)) key = `_${key}`;
      output[key] = truncatedMarker;
      break;
    }
    output[key] = serializeProperty(key, child);
  }
  if (sourceTruncated) addTruncationMarker(output, truncatedMarker);
  return output;
}

function addTruncationMarker(output, marker) {
  let key = '__truncated';
  while (Object.hasOwn(output, key)) key = `_${key}`;
  output[key] = marker;
}
